# Research — 논문·기술 리뷰 인덱스

논문, 기술 블로그, 아티클 요약을 모아두는 곳.
각 항목은 한 줄 요약 + 핵심 포인트 + 링크 형태로 정리하면 나중에 검색·참조하기 좋습니다.

---

## 논문 목록

| 논문 | 연도 | 한 줄 요약 | 키워드 |
|------|------|-----------|-------|
| [Attention Is All You Need](./attention-is-all-you-need.md/) | 2017 | Transformer: 순환을 없애고 self-attention만으로 병렬·장거리 시퀀스 모델링 | #transformer #attention #foundation-model #LLM |
| [CLIP](./clip.md/) | 2021 | 4억 쌍 웹 이미지-텍스트 대조 사전학습으로 제로샷 이미지 분류 구현 — VLM 시대의 시초 | #VLM #contrastive-learning #zero-shot #foundation-model |
| [RT-2](./rt-2.md/) | 2023 | 웹 스케일 VLM을 공동 파인튜닝해 로봇 액션을 언어 토큰으로 출력하는 VLA | #VLA #foundation-model #data #sim2real |
| [OpenVLA](./openvla.md/) | 2024 | 970k 로봇 궤적으로 학습한 오픈소스 7B VLA — 55B 클로즈드 모델에 필적 | #VLA #open-source #foundation-model #data |
| [SmolVLM](./smolvlm.md/) | 2025 | 자원 효율적인 토큰화로 온디바이스가 가능한 소형 VLM | #VLM #efficient #on-device |

---

## 키워드별 분류

- **#VLA** — Vision-Language-Action
- **#VLM** — Vision-Language Model
- **#LLM** — Large Language Model
- **#transformer** — Transformer 아키텍처
- **#attention** — 어텐션 메커니즘
- **#foundation-model** — 대규모 사전학습 모델
- **#data** — 데이터 파이프라인, 품질, 규모
- **#sim2real** — 시뮬레이션→실세계 전이
- **#open-source** — 공개 가중치 및 코드
- **#efficient** — 연산/메모리 효율
- **#on-device** — 엣지/온디바이스 배포
- **#contrastive-learning** — 대조 학습 (예: CLIP)
- **#zero-shot** — 태스크별 레이블 없이 제로샷 전이
