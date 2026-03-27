# Diffusion Policy: Visuomotor Policy Learning via Action Diffusion

*arXiv / RSS 2023* (Diffusion Policy)

---

## 1) 간략한 내용 (공개일, 주요 저자 등)

- **공개일:** 2023-03 (arXiv v1 **2023-03-07** 공개; RSS 2023)
- **메인 링크:** [diffusion-policy.cs.columbia.edu](https://diffusion-policy.cs.columbia.edu/)
- **arXiv:** [2303.04137](https://arxiv.org/abs/2303.04137)
- **주요 저자(대표):** Cheng Chi, Siyuan Feng, Yilun Du, Zhenjia Xu, Eric Cousineau, Benjamin Peng, Shuran Song (Columbia University, MIT, Toyota Research Institute)
- **GitHub:** [github.com/real-stanford/diffusion_policy](https://github.com/real-stanford/diffusion_policy)

---

## 2) 상세 내용

### 핵심 아이디어: 액션 생성을 디노이징 확산 과정으로 정의

기존 로봇 모방 학습(imitation learning) 방식은 정책 학습을 회귀(주어진 관측에서 단일 액션 벡터를 직접 예측) 또는 분류(액션 공간을 이산화) 문제로 다뤄왔다. 두 접근 모두 시연 데이터에 **다중 모달 액션 분포(multi-modal action distribution)** — 같은 태스크를 수행하는 복수의 유효한 방법 — 가 존재할 때 무너진다. 회귀는 평균값으로 수렴하고, 분류는 세심한 이산화 설계를 필요로 하기 때문이다.

Diffusion Policy는 문제를 재정의한다. 액션을 직접 예측하는 대신, 현재 시각적 관측을 조건으로 삼아 **가우시안 노이즈로부터 액션 시퀀스를 반복적으로 디노이징**하도록 정책을 학습한다. 이미지 생성에 사용되는 DDPM(denoising diffusion probabilistic model) 프레임워크를 로봇 액션 시퀀스에 그대로 적용한 것이다.

추론 시에는 랜덤 샘플 $\mathbf{a}_T \sim \mathcal{N}(0, I)$에서 시작해 학습된 디노이징 함수를 $T$ 스텝 반복 적용함으로써 깨끗한 액션 청크 $\mathbf{a}_0$에 도달한다:

$$\mathbf{a}_{t-1} = \frac{1}{\sqrt{\alpha_t}}\left(\mathbf{a}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}} \epsilon_\theta(\mathbf{a}_t, t, \mathbf{o})\right) + \sigma_t \mathbf{z}$$

여기서 $\epsilon_\theta$는 관측 $\mathbf{o}$를 조건으로 하는 학습된 노이즈 예측 네트워크이고, $\mathbf{z} \sim \mathcal{N}(0, I)$이다.

### 액션 청킹과 리시딩 호라이즌 제어

단일 스텝 액션 대신, Diffusion Policy는 **액션 청크**: 미래 $H_p$ 스텝의 액션 시퀀스를 한 번에 예측한다. 전체 청크를 실행하면 시간적 일관성이 높아진다 — 로봇이 매 타임스텝마다 재결정하는 대신 일관된 동작 궤적에 전념하기 때문이다. 그러나 환경 변화에 반응하기 위해 재계획(replanning)은 여전히 필요하다.

이를 해결하는 방법이 **리시딩 호라이즌 제어(receding horizon control)**: 매 스텝마다 $H_p$개의 액션 청크를 새로 생성하되, 재계획 전에 첫 $H_a < H_p$개만 실행한다. 시간적 일관성과 실시간 반응성을 동시에 확보하는 방식이다.

### 아키텍처 변형

노이즈 예측 네트워크 $\epsilon_\theta$에 대해 두 가지 백본 변형을 제안한다:

| 변형 | 관측 인코더 | 디노이저 | 추론 스텝 수 |
|-----|-----------|---------|------------|
| **DDPM + CNN** | CNN (ResNet 계열) | 1D 시간축 U-Net | ~100 스텝 |
| **DDPM + Transformer** | ViT / Transformer | 크로스어텐션 Transformer | ~100 스텝 |
| **DDIM + CNN/Transformer** | 위와 동일 | 위와 동일 + DDIM 스케줄러 | ~10 스텝 (10배 빠름) |

시각적 관측(RGB 이미지 또는 포인트 클라우드)은 **FiLM 컨디셔닝**(CNN 변형) 또는 **크로스어텐션**(Transformer 변형)을 통해 디노이저에 주입된다. DDIM(denoising diffusion implicit models)은 품질 손실을 최소화하면서 추론을 ~10 스텝으로 단축해 실시간 제어를 현실적으로 만든다.

### 결과

시뮬레이션과 실제 로봇 환경을 포함한 12개 태스크에서 평가했다. 비교 베이스라인은 Behavior Cloning(BC), Implicit Behavioral Cloning(IBC), BC-RNN, BET(Behavior Transformer)이다.

**시뮬레이션 벤치마크 (평균 성공률):**

| 방법 | 평균 성공률 |
|-----|-----------|
| BC | ~48% |
| IBC | ~53% |
| BC-RNN | ~61% |
| BET | ~65% |
| **Diffusion Policy (CNN)** | **~76%** |
| **Diffusion Policy (Transformer)** | **~79%** |

**실제 로봇 태스크:** 태스크당 50~100개의 원격조작(teleoperated) 데모로 학습한 다단계 주방 조작 태스크(컵 정렬, 스프레드 바르기 등)에서 테스트했다. Diffusion Policy는 BC가 모드 평균화로 실패하는 다중 모달·접촉이 많은 태스크에서 특히 두드러진 성능 우위를 보인다.

### 한계

- **추론 지연:** DDPM 변형은 액션 청크당 ~100회 디노이징 스텝이 필요하다. DDIM이 이를 줄이지만, 단일 순전파(forward pass) 방식 정책에 비해 여전히 오버헤드가 있다. 실시간 성능을 위해서는 GPU 추론 또는 DDIM 스텝 수 적극 감소가 필요하다.
- **학습 안정성:** 스코어 매칭 손실은 하이퍼파라미터(노이즈 스케줄, 확산 스텝 수, 액션 정규화)에 민감할 수 있다.
- **액션 공간 범위:** 말단 장치(end-effector) 제어(6-DOF 자세 + 그리퍼)에서 평가됐다. 전체 관절 공간이나 전신 제어로 확장하는 것은 단순하지 않다.
- **언어 컨디셔닝 부재:** 원본 논문은 시각 관측만 조건으로 사용한다. 언어 조건 변형은 자연스러운 확장이며 이후 연구(Diffusion Policy 3D, DP3 등)에서 탐색됐다.

---

## 3) 왜 중요한 논문인가

- **정책 표현의 패러다임 전환:** Diffusion Policy는 확산 생성 모델을 로봇 비주모터 정책에 처음으로 체계적으로 적용한 연구다. 회귀와 분류를 넘어 새로운 패러다임을 열었으며, 이후 ACT, $\pi_0$, RoboFlamingo, Octo 같은 아키텍처에 직접적인 영향을 미쳤다.
- **일반 원칙으로서의 액션 청킹:** 단일 액션이 아닌 액션 *시퀀스*를 예측하면 시간적 일관성이 크게 향상된다는 통찰은 커뮤니티에 빠르게 수용됐다. ACT(Action Chunked Transformers)와 $\pi_0$ 모두 이 원칙을 명시적으로 채택한다.
- **다중 모달 분포 처리:** 많은 실제 조작 태스크는 해결 공간이 본질적으로 다중 모달이다(왼쪽 또는 오른쪽에서 집기, 여러 접근 각도 등). 확산 모델은 이를 자연스럽게 처리하는 반면, 회귀 기반 정책은 평균값으로 수렴해 실패한다. 이는 벤치마크 수치의 차이가 아니라 근본적인 능력의 차이다.
- **소규모 데이터 실용성:** 태스크당 50~100개 데모로 강력한 성능을 발휘하므로, 대규모 데이터 수집이 비용이 큰 실제 로봇 배포 환경에서 현실적인 방법이 된다. 수천 개의 궤적이 필요한 방법들과 구분되는 핵심 실용적 장점이다.

---

## 4) Config 적용 사례

- **양팔 액션 표현:** Diffusion Policy의 액션 청크 + 리시딩 호라이즌 프레임워크는 양팔 협응에 직접 적용 가능하다. 한 팔의 궤적만 예측하는 대신, 왼팔과 오른팔의 청크를 동시에 예측해 팔 간 상관관계를 포착할 수 있다 — 팔별 독립 정책이 놓치는 부분이다.
- **다중 모달 파지 및 배치:** 양팔 조작은 본질적으로 다양한 유효 솔루션 경로를 가진다(어느 손이 선행하는지, 접근 방향, 어느 쪽에 놓는지 등). 확산 모델은 이러한 다중 모달 분포를 자연스럽게 처리하는 반면, BC 스타일 정책은 운동학적으로 불가능한 혼합 솔루션으로 수렴한다.
- **인간 시연 파이프라인의 데이터 효율성:** Diffusion Policy는 태스크당 50~100개의 원격조작 시연으로 좋은 성능을 내므로, Config의 인간 시연 데이터 수집 파이프라인과 직접 맞닿는다. 대규모 데이터 없이도 고품질 정책을 빠르게 구축할 수 있다.
- **원격조작 데이터 호환성:** 원본 논문은 도메인 랜덤화나 시뮬레이션-실제 전이 없이 원격조작 시연만으로 학습한다. Config가 수집하는 원격조작 데이터는 정규화 외에 특별한 전처리 없이 이 학습 방식과 완전히 호환된다.
- **실시간 제어를 위한 DDIM:** DDIM 변형은 디노이징을 ~10 스텝으로 줄여 온보드 컴퓨트에서도 실시간 추론이 가능하다. Config는 배포 사이클 타임을 목표로 설정할 때 DDPM vs DDIM 트레이드오프를 초기에 평가해야 한다.
