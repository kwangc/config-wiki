# 로봇 데이터셋 포맷

로봇 러닝 데이터셋의 저장 포맷 설계와 트레이드오프 — LeRobot 데이터셋 포맷의 v2 → v3 진화를 중심으로.

---

## 문제: 로봇 데이터 저장 스케일링

로봇 데이터셋은 멀티모달 시계열: 에피소드마다 고주파 센서 데이터(proprioception, 액션)를 담은 테이블 데이터 + 카메라 스트림(비디오)이 존재. 단순하게 에피소드별 파일로 저장하면 대규모에서 I/O 병목이 발생한다.

---

## LeRobot Dataset v2.x (에피소드별 파일 포맷)

**구조:**
```
episode-0000.parquet   ← 에피소드 하나당 Parquet 하나
episode-0001.parquet
episode-0000.mp4       ← 에피소드 하나당 MP4 하나 (카메라별)
episode-0001.mp4
meta/info.json
meta/stats.json
```

**특성:**
- 에피소드 단위로 직관적이고 검사하기 쉬움
- 소규모 데이터셋(수백 에피소드)에서는 충분

**대규모에서의 병목:**

핵심 문제는 **학습 배치당 파일 오픈 횟수**. v2에서는 학습 샘플 하나 = 에피소드 파일 하나와 1:1 대응:

- 배치 크기 64, 각 샘플이 다른 에피소드 → 동시에 최대 64개 Parquet + 64개 MP4 파일 열어야 함
- 멀티 GPU, DataLoader 워커 N개 × 배치 64 → 파일 오픈 수가 곱으로 증가
- OS 레벨 한계에 걸림: file descriptor 한도, 동시 mmap 한도
- **GPU를 더 늘려도 해결 안 됨** — I/O 병목이 구조적 문제이지 연산 부족이 아니기 때문

---

## LeRobot Dataset v3.0 (청크 파일 포맷)

LeRobot v0.4.0 (2025년 10월)에 도입.

**구조:**
```
data/
  file-0000.parquet    ← 파일 하나에 여러 에피소드
  file-0001.parquet
videos/
  chunk-000/observation.images.top/
    episode-0000000.mp4
    episode-0000001.mp4
    ...
meta/
  info.json            ← 스키마, FPS, 경로 템플릿
  stats.json           ← 정규화 통계 (mean/std/min/max)
  tasks.jsonl          ← 태스크 설명 → 정수 ID 매핑
  episodes/            ← 에피소드 오프셋 (청크 Parquet)
    chunk-000.parquet
```

**핵심 설계 원칙:** 저장 레이아웃과 사용자 API를 분리. 데이터는 소수의 큰 파일로 저장하되, 사용자 API는 여전히 에피소드 단위 접근을 제공.

**병목 해결 방식:**

- N개 에피소드가 하나의 Parquet/MP4 파일을 공유
- 64개 배치 샘플이 다른 에피소드에서 와도 실제 열리는 파일은 1~2개
- 파일 오픈 횟수: `O(배치 크기)` → `O(배치 크기 / 청크당 에피소드 수)`로 감소
- 순차 읽기 패턴으로 캐시 효율도 향상
- GPU를 더 늘리면 실제로 throughput이 증가 — 이제 병목이 연산 쪽

**에피소드 경계 추적:**
- 에피소드 오프셋(시작/끝 바이트 위치, 프레임 인덱스 범위)을 `meta/episodes/`에 저장
- 에피소드별 뷰 복원은 파일명이 아닌 메타데이터로 처리

---

## v3.0 추가 기능

**Hub 네이티브 스트리밍** (`StreamingLeRobotDataset`):
- Hugging Face Hub에서 다운로드 없이 직접 스트리밍
- 로컬 저장 없이 OXE 규모(400GB+) 데이터셋으로 학습 가능

**데이터셋 편집 도구** (v0.4.0+):
- `lerobot-edit-dataset` CLI로 에피소드 삭제, 분할/병합, 피처 추가/제거
- 서브태스크 어노테이션, 이미지→비디오 변환

**스트리밍 비디오 인코딩** (v0.5.0+):
- 녹화 중 실시간 프레임 인코딩 (에피소드 간 대기시간 없음)
- 하드웨어 인코더 자동 감지 (GPU 가속 인코더 사용 가능 시 자동 적용)

---

## v2.1 → v3.0 마이그레이션

```bash
python -m lerobot.datasets.v30.convert_dataset_v21_to_v30 \
  --repo-id=<HF_USER/DATASET_ID>
```

하는 일:
- `episode-0000.parquet`, `episode-0001.parquet`, ... → `file-0000.parquet`, ...로 집약
- `episode-0000.mp4`, `episode-0001.mp4`, ... → 병합 파일로 집약
- `meta/episodes/`를 바이트/프레임 오프셋으로 재작성

---

## Config 맥락에서

- v2 → v3 패턴은 Config 데이터 파이프라인에 직접 적용 가능: 에피소드 수가 늘어나면 에피소드별 파일 저장은 동일한 I/O 벽에 부딪힘
- 메타데이터 기반 오프셋의 청크 파일 포맷이 멀티 GPU 학습 스케일에 맞는 아키텍처
- Hub 네이티브 스트리밍은 저장 공간이 제약인 분산 학습 환경에서 평가해볼 만한 옵션

---

## 참고

- [Data & Scaling](./01-data-scaling/)
- [Hugging Face LeRobot](../../../05-industry/11-huggingface-lerobot/)
- [모델 학습](../04-model-training/01-overview/)
