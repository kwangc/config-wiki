# Teleoperation(teleop)

사람이 직접 로봇을 조작해서 **데모 데이터를 수집**하는 방식.

---

## Teleop이 필요한 이유

로봇·VLA 학습에서는:

- **실제 환경에서 무작위 RL만으로 학습하기엔 비용·위험이 큼**
- 사람이 시연한 데모는 *어떻게* 해야 하는지에 대한 강력한 prior를 제공

그래서 실무에서는 보통:

1. Teleop으로 데모를 수집하고
2. Behavior Cloning(BC)으로 초기 policy를 학습한 뒤
3. 필요하면 RL(PPO 등)로 미세 조정하는 흐름을 많이 사용합니다.

---

## 무엇을 기록해야 하나? (최소 로그 스키마)

각 step $t$마다:

- **상태** $s_t$
  - 관측: 이미지/비디오 $I_t$ (single/multi-view)
  - 로봇 proprioception: 관절각 $q_t$, 속도 $\dot{q}_t$, 그리퍼 상태
  - (가능하면) 엔드이펙터 pose $\mathbf{x}_t$ (position + orientation)
  - (선택) 힘/토크, 촉각, depth/point cloud
  - (선택) 언어 지시 $u$ (보통 episode 단위)
- **행동** $a_t$
  - joint command (토크/속도), 또는
  - end-effector delta $\Delta \mathbf{x}_t$ + gripper command
- **타임스탬프** $t$ 또는 $\Delta t$ (동기화에 중요)

개념적으로는:

$$
(u,\; I_t,\; \mathbf{r}_t)\;\rightarrow\; a_t
$$

여기서 $\mathbf{r}_t$는 관절·그리퍼·EE pose 등을 묶은 로봇 상태 벡터입니다.

---

## 데이터 품질 체크리스트

- **동기화(sync)**: 이미지와 action의 시간이 맞는가?
- **액션 표현**: joint-space vs EE-space — 제어 스택과 일관성
- **노이즈 / 손떨림**: 필요할 경우 smoothing
- **성공/실패 라벨링**: episode별 결과와 실패 이유(쏟기, 충돌 등)
- **초기 상태 다양성**: 한 가지 초기 상태만 반복하지 않기

---

## 양손(바이매뉴얼) teleop에서 자주 생기는 포인트

예: 왼손으로 컵을 들고 오른손으로 팝콘을 퍼 담는 태스크라면:

- 왼손: 컵을 안정적으로 유지 (pose 유지 + 그리퍼 유지)
- 오른손: 스쿱/이동/붓기 동작 수행

이 역할 분리는:

- 로그 구조 (`action_left`, `action_right`)와
- 이후 policy/action head 설계에도 그대로 반영되는 것이 좋습니다.

---

## 참고

- [Behavior Cloning](03-behavior-cloning.md)
- [Robotics](../01-robotics/01-robotics.md)
- [Data & Scaling](../05-data-scaling/01-data-scaling.md)

---

## Food for Thought

- teleop은 실세계에서 비용·위험이 큰 편이고, 데이터의 품질은 동기화와 action 로깅 안정성에 좌우됩니다; 해결하면 latency-aware capture + 자동 품질 점수로 데모 수집을 “반복 가능한 제품 프로세스”로 만들 수 있습니다.
- teleop 로그는 액션 표현(joint-space vs EE-space)이 실제 control stack과 맞지 않으면 학습이 바로 무너집니다; 해결 기회는 스키마 계약(contracts)과 자동 검증/변환을 툴링으로 표준화하는 것입니다.
- 바이매뉴얼은 왼손/오른손 역할 분리가 데이터/헤드 설계로 직결됩니다; 이 역할 분리를 반영한 좌/우 action capture 스키마와 시나리오 템플릿을 제품화하면 커버리지가 산발적이 아니라 체계적으로 쌓입니다.
