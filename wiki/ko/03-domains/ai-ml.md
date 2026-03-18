# AI / ML 기초

Foundation Model·로봇 제품을 이해하기 위한 AI/ML 기본 개념 정리.

---

## 핵심 개념 (채워나가기)

- **Supervised / Unsupervised / Reinforcement Learning**
- **Deep Learning** — NN, 백프로파게이션, 최적화
- **Foundation Model** — 사전학습, 파인튜닝, 제로샷/ few-shot
- **Evaluation** — 메트릭, 벤치마크, 실세계 검증

---

## Config 맥락에서

- 데이터 품질이 모델 성능과 직결
- "Closing the loop" = 학습 → 물리 세계 테스트 → 데이터/모델 개선

---

## 참고

- `../../04-research/` — 관련 논문 요약
- `../../study/ai-ml/` — 개인 학습 노트

---

## Food for Thought

- ML 평가가 정적 벤치마크 중심이면 로봇 성공과 상관이 약할 수 있는데, 그래서 “train/test”만으로는 부족합니다; 로보틱스 기준의 지표와 closed-loop 물리 검증을 같이 정의하면 평가는 제품 의사결정 엔진이 됩니다.
- 데이터 품질은 supervised/unsupervised/RL 전 범위에서 성능에 직결되지만, 보통 백그라운드로 취급됩니다; 데이터 파이프라인을 품질 게이트가 있는 1급(product) 표면으로 만들면 모델 개선이 누적 가능한 방식으로 됩니다.
- foundation model의 능력을 실시간·안전 액션 생성으로 번역하려면 인터페이스/지연/안전 계약이 필요합니다; 모델 출력과 policy/supervisor 스택 사이의 표준 인터페이스를 만들면 AI 역량을 “믿을 수 있는 로봇 동작”으로 전환할 수 있습니다.

