# Attention Is All You Need

*arXiv / NeurIPS 2017* (Transformer)

---

## 1) 간략한 내용 (공개일, 주요 저자 등)

- **공개일:** 2017-06 (arXiv v1 **2017-06-12** 공개; NeurIPS 2017 채택)
- **arXiv:** [1706.03762](https://arxiv.org/abs/1706.03762)
- **주요 저자:** Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin (Google Brain / Google Research)

---

## 2) 상세 내용

### 핵심 아이디어: 순환(recurrence)을 없애고 self-attention만으로

기존 시퀀스 모델(RNN, LSTM, 확장 합성곱 CNN)은 토큰을 순차적으로 처리하기 때문에 학습 병렬화가 어렵고, 장거리 의존성(long-range dependency) 모델링에도 한계가 있었습니다.

이 논문은 **Transformer**를 제안합니다. 순환(recurrence)과 합성곱(convolution)을 완전히 제거하고, **어텐션 메커니즘만**으로 입력과 출력 사이의 전역 의존성을 포착하는 모델입니다.

### Self-Attention (Scaled Dot-Product Attention)

핵심 연산:

$$\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

- **Q**(Query), **K**(Key), **V**(Value)는 입력의 선형 투영입니다.
- $\sqrt{d_k}$로 스케일링해 고차원에서 내적값이 커져 그래디언트가 소실되는 현상을 방지합니다.
- 모든 위치가 모든 다른 위치를 직접 참조할 수 있어, 임의 두 위치 간 경로 길이가 O(1)입니다(RNN은 O(n)).

### Multi-Head Attention

어텐션을 하나만 쓰는 대신, Q/K/V를 **h**개의 저차원 부분 공간에 투영해 각각 어텐션을 계산한 후 이어 붙이고 다시 투영합니다.

$$\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1,\dots,\text{head}_h)W^O$$

서로 다른 표현 공간에서 다양한 위치의 정보를 동시에 참조할 수 있게 합니다.

### 인코더-디코더 구조

- **인코더**: 동일한 레이어 N=6개 스택. 각 레이어는 (1) multi-head self-attention + (2) position-wise 피드포워드 네트워크. 각 서브레이어 주변에 잔차 연결(residual connection) + 레이어 정규화(layer normalization).
- **디코더**: 같은 스택에 세 번째 서브레이어인 **크로스 어텐션**이 추가됨(인코더 출력을 참조). 디코더의 self-attention은 미래 위치를 참조하지 못하도록 마스킹됨.

### 위치 인코딩 (Positional Encoding)

순환도, 합성곱도 없으므로 위치 정보를 **사인/코사인 함수로 만든 위치 인코딩**을 입력 임베딩에 더해서 주입합니다.

$$PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d_{model}})$$
$$PE_{(pos, 2i+1)} = \cos(pos / 10000^{2i/d_{model}})$$

사인파 형태 덕분에 학습 중 보지 못한 길이의 시퀀스에도 일반화되고, 선형 조합으로 상대 위치를 추론할 수 있습니다.

### 학습 설정

- **태스크:** 영→독, 영→불 기계번역 (WMT 벤치마크)
- **옵티마이저:** Adam + 커스텀 학습률 스케줄 (warm-up 후 $\propto \text{step}^{-0.5}$ 감소)
- **정규화:** 드롭아웃 + 레이블 스무딩(ε=0.1)
- **하드웨어:** NVIDIA P100 8장; 기본 모델 약 12시간 학습

### 결과

| 모델 | EN→DE BLEU | EN→FR BLEU | 학습 비용 |
|---|---|---|---|
| Transformer (base) | 27.3 | 38.1 | 0.5 GPU-days |
| Transformer (big) | **28.4** | **41.0** | 6 GPU-days |
| 기존 최고 앙상블 | 26.4 | 41.1 | >> |

Transformer (big)는 EN→DE에서 SOTA를 달성하면서도 학습 비용은 기존 최고 대비 ~10배 적습니다.

### 어블레이션: 실제로 중요한 것

논문이 각 요소를 어블레이션합니다.

- 어텐션 헤드 수가 적거나 헤드 차원이 맞지 않으면 → 성능 저하
- 위치 인코딩 제거 → 큰 성능 저하
- 닷프로덕트 어텐션 → 어디티브 어텐션으로 교체 → 스케일에서 약간 떨어짐
- 모델 깊이 축소 → BLEU 일관 하락

---

## 3) 왜 중요한 논문인가

- Transformer는 이후 **모든 현대 NLP, 비전, 멀티모달 모델의 공통 백본**이 되었습니다 (BERT, GPT, ViT, PaLM, LLaMA, Gemini 등).
- Self-attention의 O(1) 경로 길이는 RNN이 힘들어하던 **장거리 의존성 모델링**을 해결했습니다.
- 완전한 병렬 학습이 가능해지면서 GPU/TPU 자원을 효율적으로 활용할 수 있게 됐고, 오늘날 AI 스케일링 법칙의 기반이 됐습니다.
- 구조가 **모달리티 불가지론적(modality-agnostic)**입니다. 텍스트, 이미지, 오디오, 비디오, 포인트 클라우드, 그리고 **로봇 액션 토큰**(RT-2 등)까지 동일한 메커니즘이 적용됩니다.

---

## 4) Config 적용 사례

- **VLA 스택의 토대:** Config가 사용하는 모든 VLM/LLM 백본(PaLI-X, Gemini 등)은 Transformer입니다. 원래 아키텍처 — 특히 크로스 어텐션과 인코더-디코더 경계 — 를 이해하면, 로봇 제어를 위해 모델을 파인튜닝하거나 변형할 때 설계 판단을 더 잘 내릴 수 있습니다.
- **액션 토큰 공간 설계:** RT-2가 로봇 액션을 토큰으로 처리한다는 아이디어는 Transformer의 시퀀스 생성 프레임워크에 자연스럽게 꽂힙니다. 디코더 인과 마스크를 "유효 액션 마스크"로 바꾸는 트릭도 이 논문의 디코더 self-attention 마스킹의 연장선입니다.
- **멀티모달 융합을 위한 크로스 어텐션:** 인코더-디코더 크로스 어텐션 패턴(언어 쿼리 → 시각적 키/값 참조)은 VLA 모델에서 언어 지시가 시각 관측에 조건화되는 방식의 개념적 템플릿입니다.
- **로봇 상태를 위한 위치 인코딩:** 로봇 관측이나 액션 히스토리의 시간적 시퀀스를 인코딩할 때, 위치 인코딩 전략(사인파 vs. 학습된 인코딩 vs. RoPE)이 모델이 타임스텝과 액션 순서를 얼마나 잘 추적하는지에 직접 영향을 줍니다.

