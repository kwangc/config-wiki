# CLIP: Learning Transferable Visual Models From Natural Language Supervision

*arXiv / ICML 2021* (CLIP)

---

## 1) 간략한 내용 (공개일, 주요 저자 등)

- **공개일:** 2021-01 (arXiv v1 **2021-01-05** 공개; ICML 2021)
- **메인 링크:** [openai.com/research/clip](https://openai.com/research/clip)
- **arXiv:** [2103.00020](https://arxiv.org/abs/2103.00020)
- **주요 저자(대표):** Alec Radford, Jong Wook Kim, Chris Hallacy, Aditya Ramesh, Gabriel Goh, Sandhini Agarwal, Girish Sastry, Amanda Askell, Pamela Mishkin, Jack Clark, Gretchen Krueger, Ilya Sutskever (OpenAI)
- **GitHub:** [github.com/openai/CLIP](https://github.com/openai/CLIP)

---

## 2) 상세 내용

### 핵심 아이디어: 이미지-텍스트 쌍 대조 사전학습

기존 시각 모델은 강한 성능을 위해 대규모 수작업 레이블 데이터셋(예: ImageNet)에 의존했다. CLIP의 질문: *수작업 레이블을 자연어 지도(supervision)로 대체할 수 있는가?*

CLIP은 웹에서 **(이미지, 텍스트) 쌍 4억 개**를 수집한다. 텍스트는 이미지에 붙은 캡션이나 alt-text다. 두 인코더를 함께 훈련한다:

- **이미지 인코더** — ResNet 또는 Vision Transformer(ViT)
- **텍스트 인코더** — Transformer (GPT-2 구조와 유사)

학습 목표는 **대조 손실(contrastive loss)**: 배치 N개의 (이미지, 텍스트) 쌍 중 올바른 N개 쌍의 코사인 유사도는 최대화하고, 틀린 N² − N 쌍은 최소화한다.

$$L = -\frac{1}{N} \sum_{i=1}^{N} \left[ \log \frac{\exp(\text{sim}(i_i, t_i)/\tau)}{\sum_{j=1}^{N} \exp(\text{sim}(i_i, t_j)/\tau)} + \log \frac{\exp(\text{sim}(i_i, t_i)/\tau)}{\sum_{j=1}^{N} \exp(\text{sim}(i_j, t_i)/\tau)} \right]$$

$\tau$는 학습 가능한 온도(temperature) 파라미터다.

### 제로샷 전이

사전학습 후 CLIP은 **레이블 데이터 없이** 이미지를 분류할 수 있다. 예를 들어 `["고양이", "개", "자동차"]` 클래스가 있다면:

1. 각 클래스를 텍스트 프롬프트로 임베딩: `"a photo of a {class}"`
2. 쿼리 이미지를 이미지 인코더로 임베딩
3. 이미지 임베딩에 가장 가까운 텍스트 임베딩의 클래스로 분류

ImageNet 제로샷 top-1 정확도 76.2%(ViT-L/14)는 완전 지도 학습 ResNet-50과 동등 — 당시 매우 충격적인 결과였다.

### 아키텍처

| 구성요소 | 선택지 |
|---------|--------|
| 이미지 인코더 | ResNet-50 ~ ResNet-101; ViT-B/32 ~ ViT-L/14 |
| 텍스트 인코더 | Transformer (63M 파라미터, 12레이어, 512차원) |
| 임베딩 차원 | 512 (ResNet) ~ 768 (ViT-L/14) |

가장 큰 모델인 ViT-L/14@336px가 이후 연구에서 사실상 표준 CLIP 백본으로 자리잡았다.

### 결과

- **제로샷 ImageNet**: 76.2% top-1 (ViT-L/14) — 지도 학습 기반 모델과 경쟁 가능한 수준
- 27개 분류 데이터셋(ObjectNet, EuroSAT, CIFAR-100 등)에서 강력한 일반화 성능
- 분포 변화(distribution shift)에 강건 — ImageNet-V2, -Sketch, -A, -R 변형에서 지도 학습 모델 능가
- 선형 프로브(고정된 특징 + 선형 분류기)로도 완전 파인튜닝된 ResNet과 동등하거나 능가

---

## 3) 왜 중요한 논문인가

- **자연어가 고정 레이블보다 훨씬 확장 가능한 지도 신호임을 입증** — 웹 텍스트 4억 쌍이 정밀하게 레이블된 ImageNet 수준 데이터를 능가했다.
- **공유 이미지-텍스트 임베딩 공간**이라는 크로스모달 추론의 구조적 전제를 제시했다. LLaVA, InstructBLIP, Flamingo 등 이후 모든 주요 VLM이 이 위에 구축된다.
- 텍스트 프롬프트 기반 제로샷 전이로 **언어 그라운딩이 오픈 보캐뷸러리 인식을 가능하게 함**을 보여줬다 — 모델이 사전에 어떤 클래스를 볼지 알 필요가 없어졌다.
- CLIP 시각 인코더는 **표준 재사용 가능 백본**이 됐다: DALL-E 2, Stable Diffusion, 대부분의 VLM이 (고정 또는 파인튜닝해서) 사용한다. OpenVLA에 쓰인 SigLIP도 CLIP의 직계 후속이다.

---

## 4) Config 적용 사례

- **로봇용 오픈 보캐뷸러리 객체 인식**: CLIP의 텍스트 프롬프트 기반 제로샷 분류는 "빨간 컵을 잡아라", "가장 무거워 보이는 물체" 같이 태스크별 재훈련 없이 동작해야 하는 로봇에 직접 활용 가능하다. Config는 CLIP 스타일의 텍스트-이미지 유사도를 그라운딩 레이어로 쓸 수 있다.
- **시각 백본 선택 기준**: VLA 모델용 비전 인코더를 고를 때 CLIP ViT-L/14와 그 후속(SigLIP, EVA-CLIP)이 검증된 출발점이다. 왜 작동하는지 이해하면 Config 퍼셉션 스택의 설계 트레이드오프 판단에 도움이 된다.
- **새 환경을 위한 대조 파인튜닝**: 같은 대조 학습 레시피를 도메인 데이터(로봇 시점 이미지 + 액션 설명)에 적용해 Config 특정 환경에 맞는 그라운딩된 시각 표현을 만들 수 있다.
- **프롬프트 엔지니어링으로 제로샷 API 구성**: CLIP의 `"a photo of a {class}"` 패턴은 어포던스 프롬프트로 확장된다: `"a graspable object"`, `"an open container"`. Config는 이 패턴으로 경량 프롬프트 기반 퍼셉션 모듈을 구축할 수 있다.
