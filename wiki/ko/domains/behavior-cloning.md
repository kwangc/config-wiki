# Behavior Cloning (BC)

teleop·스크립트 등으로 수집한 **데모 데이터**를 따라 하도록 policy를 학습하는 방법.

---

## 문제 설정

- 데이터셋 $\mathcal{D}$: 데모에서 얻은 $(s_t, a_t)$ 시퀀스들
  - $s_t$: 이미지, 로봇 상태, 언어 지시 등
  - $a_t$: 사람이 실제로 준 action (EE 이동, 그리퍼 명령, joint 명령 등)
- 목표: 주어진 state에서 사람이 했던 action을 **가능한 한 잘 모사하는** policy $\pi_\theta$ 학습

---

## 지도학습 관점

BC는 본질적으로 **지도학습**입니다.

- 입력: $s_t$
- 레이블: $a_t$
- 모델: $\pi_\theta(s_t)$

연속 action일 때 전형적인 loss는 다음과 같습니다.

$$
\mathcal{L}_{\text{BC}}(\theta)
  = \mathbb{E}_{(s,a) \sim \mathcal{D}} \big[ \lVert \pi_\theta(s) - a \rVert^2 \big]\,.
$$

직관:

- 같은 상태 $s_t$에서,
- 사람이 선택한 action $a_t$와 최대한 비슷한 출력을 내도록 $\theta$를 조정합니다.

---

## Teleop / RL과의 관계

실무에서 자주 쓰이는 흐름:

1. **Teleop**: 목표 태스크에 대해 많은 $(s_t, a_t)$ 데모 로그를 모음
2. **BC**: 위 loss로 초기 policy를 학습
3. **RL**: (선택) 보상 기반으로 policy를 미세 조정

BC의 강점:

- 빠르게 \"사람처럼\" 동작하는 정책을 만들 수 있음
- VLA, 바이매뉴얼 로봇처럼 복잡한 공간에서 좋은 초기 정책을 제공

RL의 강점:

- 사람 데모를 넘어서는 성능 개선
- 실패 복구 행동, 세밀한 최적화 등 학습

---

## Covariate shift (분포 이동) 문제

핵심 이슈:

- 학습 시: **사람이 만든 trajectory 상의 state 분포**만 본다.
- 실행 시: **정책이 스스로 만들어내는 state 분포**를 보게 된다.

이 차이를 **covariate shift / distribution shift** 라고 합니다.

완화 전략:

- **DAgger류 알고리즘**:
  - 정책이 행동한 trajectory를 사람이 다시 레이블링
  - 새로운 데이터를 $\mathcal{D}$에 합쳐 재학습
- **데모 다양성 증가**:
  - 초기 상태, 환경 조건, 시연 스타일을 다양하게 수집
- **RL과 조합**:
  - BC로 초기화하고, RL로 복구·견고성을 추가 학습

---

## 참고

- [Teleoperation](teleops.md)
- [Robot Learning (RL)](robot-learning-rl.md)
- [VLA](vla.md)
