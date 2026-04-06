# Hugging Face LeRobot

> Hugging Face의 오픈소스 로봇 러닝 라이브러리 및 생태계

---

## 기본 정보

- **출시:** 2024년
- **조직:** Hugging Face
- **Repo:** [huggingface/lerobot](https://github.com/huggingface/lerobot) (23k+ stars)
- **핵심 방향:** 오픈소스 풀스택 로봇 러닝 — 하드웨어 지원, 정책 모델, 데이터셋, 학습, 배포를 하나의 라이브러리로

---

## LeRobot이 하는 것

LeRobot은 Hugging Face의 오픈소스 로봇 러닝 프레임워크. 전체 스택을 커버:

- **하드웨어 통합** — SO-100/SO-101, Koch, LeKiwi, Reachy 2, Unitree G1 (휴머노이드) 등, 플러그인 시스템으로 확장 가능
- **데이터셋 인프라** — 로봇 데모 수집·공유를 위한 표준 포맷 (참고: [로봇 데이터셋 포맷](../../03-domains/05-data-scaling/02-robot-dataset-formats/))
- **정책 모델 zoo** — ACT, Diffusion Policy, Pi0, Pi0.5, Pi0-FAST, GR00T N1.5, SmolVLA, Wall-X, X-VLA, SARM
- **학습 파이프라인** — Accelerate 기반 단일/멀티 GPU 학습, PEFT/LoRA 지원
- **시뮬레이션** — LIBERO, Meta-World, NVIDIA IsaacLab-Arena, EnvHub (Hub에서 시뮬 환경 로드)

---

## 주요 릴리즈

### v0.4.0 (2025년 10월)
- **Dataset v3.0** — 에피소드별 파일 → 청크 파일 구조로 전환; OXE 규모(400GB+) 데이터셋 및 Hub 네이티브 스트리밍 지원
- **Pi0 / Pi0.5** — Physical Intelligence의 VLA 모델 통합
- **GR00T N1.5** — NVIDIA의 3B 크로스-에구디먼트 파운데이션 모델
- **하드웨어 플러그인 시스템** — 서드파티 로봇/카메라를 pip 패키지로 연결
- **프로세서 파이프라인** — 로봇↔정책 간 데이터 정규화/토크나이제이션 모듈화
- **멀티 GPU 학습** via Accelerate

### v0.5.0 (2026년 3월)
- **Unitree G1 휴머노이드** — 첫 번째 휴머노이드 통합, 전신 제어(WBC: 이동+조작 동시)
- **Pi0-FAST** — FAST 액션 토크나이제이션을 활용한 자기회귀 VLA (Gemma 300M 액션 전문가)
- **Real-Time Chunking (RTC)** — Physical Intelligence의 추론 기법; 플로우-매칭 정책의 응답성 향상
- **Wall-X** — Qwen2.5-VL 백본 + 플로우-매칭 액션 헤드
- **X-VLA** — Florence-2 백본 VLA
- **SARM** — 장기 태스크를 위한 Stage-Aware Reward Modeling
- **PEFT/LoRA** — 대형 VLA를 적은 연산으로 파인튜닝
- **스트리밍 비디오 인코딩** — 녹화 중 실시간 프레임 인코딩; 에피소드 간 대기시간 없음
- **EnvHub** — Hub에서 시뮬 환경을 직접 로드
- **Python 3.12+ / Transformers v5** — 코드베이스 현대화
- **ICLR 2026** — LeRobot 논문 채택

---

## Config 맥락에서

- LeRobot은 로봇 러닝 오픈소스 생태계의 사실상 표준; 여기서 공개되는 정책과 데이터셋이 커뮤니티 베이스라인을 설정
- Dataset v3.0 스트리밍 포맷은 Config 데이터 파이프라인 설계에 참고할 만한 아키텍처 (참고: [로봇 데이터셋 포맷](../../03-domains/05-data-scaling/02-robot-dataset-formats/))
- Pi0/Pi0.5/GR00T N1.5 통합으로 오픈소스 파운데이션 모델 파인튜닝 전략 수립 시 참고 필요

---

## 출처

- [GitHub: huggingface/lerobot](https://github.com/huggingface/lerobot)
- [블로그: LeRobot v0.4.0](https://huggingface.co/blog/lerobot-release-v040)
- [블로그: LeRobot v0.5.0](https://huggingface.co/blog/lerobot-release-v050)
- [문서: LeRobotDataset v3.0](https://github.com/huggingface/lerobot/blob/main/docs/source/lerobot-dataset-v3.mdx)
