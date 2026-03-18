# Robotics — Bimanual manipulation (draft)

목표: “두 손(bimanual)”이 왜 중요한지, 무엇이 어려운지, 그리고 그 난이도가 **하드웨어 선택**과 **시스템 아키텍처**에 어떤 요구사항을 만들어내는지 정리한다.

---

## 0) Scope

- 여기서는 **bimanual 개념/난이도/요구사항** 중심
- 유즈케이스(Serving/Organizing 등) 카탈로그는 Product의 `Task & Applications`로 연결
- 데이터/운영, Sim2Real 심화는 각각 `Data & Scaling`, `Simulation`에서 다룸

---

## 1) Why bimanual? (왜 두 손인가)

한 손으로도 pick&place는 가능하지만, 실세계에서 “사람이 자연스럽게 하는” 많은 작업은 **두 손의 역할 분담**이 들어간다.

- **Stabilize + manipulate**: 한 손은 고정/지지, 다른 손은 조작(뚜껑 열기, 비닐 뜯기)
- **Hold + insert/align**: 한 손으로 잡고, 다른 손으로 정렬/삽입(조립)
- **Fold/shape**: 물체 형상을 바꾸는 작업(수건/의류 접기)
- **Handover / regrasp**: 물체를 다른 그립으로 바꾸기 위해 손-손 전달

요약: bimanual은 “커버리지”를 확장하고, contact-rich tasks에서 성공률/안정성을 크게 올릴 수 있다.

---

## 2) Core challenges (어려운 점)

### 2.1 Coordination (협응)
- 두 팔의 움직임을 독립 제어하면 **충돌** 또는 작업 실패가 잦음
- “역할(role) 분해”(supporting vs acting)와 역할 전환이 필요

### 2.2 Contact-rich dynamics (접촉이 많다)
- 접촉은 미세한 오차/마찰/순응성에 민감
- 정해진 open-loop trajectory보다, **폐루프 제어 + 감각 피드백**이 중요해짐

### 2.3 Partial observability (가림/관측 불완전)
- 두 팔이 서로를 가리거나, 물체가 손에 가려짐(occlusion)
- 시각만으로 부족 → 촉각/힘/전류 등 보조 신호가 유용

### 2.4 Safety & recovery (안전/복구)
- 두 팔이 있어서 위험이 증가(사람/환경/자기충돌)
- 실패가 나면 “정지 → 복구 → 재시도”가 필요

---

## 3) Implications for hardware taxonomy (하드웨어 요구)

- **Workspace overlap**: 두 팔의 workspace가 충분히 겹쳐야 handover/regrasp 가능
- **End-effector choice**
  - fold/align 작업: compliant/adaptive gripper가 유리한 경우 많음
  - 단순 pick에는 suction도 강하지만, 접기/형상 변화에는 한계
- **Sensing**
  - 최소: 정확한 proprioception + 안정적인 vision(외부/eye-in-hand)
  - 있으면 강력: wrist F/T, tactile(미끄러짐/접촉 안정)
- **Compliance**
  - 순응성이 없으면 정렬/삽입/접기에서 실패가 증가

---

## 4) Implications for system architecture (아키텍처 요구)

### 4.1 Observation/action schema
- 관측: 두 팔 상태 + (가능하면) 접촉 신호를 함께
- 액션: 두 팔을 **공동(action tuple)** 으로 내보내거나, supervisor가 역할/충돌을 조율

### 4.2 Control rates and latency
- bimanual + contact 작업은 지연에 더 민감
- policy Hz, low-level Hz, 안전 watchdog의 계약을 명확히 해야 함

### 4.3 Supervision & constraints
- workspace limit, self-collision avoidance, action clamp
- “한 팔은 hold” 같은 **프리미티브/모드**를 지원하면 안정성↑

### 4.4 Recovery design
- 접촉 실패/미끄러짐/물체 낙하 → 감지 후 재시도 전략
- (데이터/운영에서 상세) 실패 케이스를 구조적으로 수집해야 학습이 빨라짐

---

## 5) Grip force control (두 손 그립 강도는 어떻게 조절하나?)

관점상 크게 두 부분으로 나눌 수 있다.

1. **Preset/profile 레벨**
   - 물체/태스크별로 “soft / normal / firm” 같은 그립 force profile을 시스템에 정의
   - 예: fragile(컵/유리), deformable(수건/의류), rigid(도구/용기) 별로 최대 힘/속도 제한 다르게
   - VLA는 보통 “어떤 profile을 쓸지”를 선택하거나, context에서 supervisor가 선택

2. **제어 레벨**
   - position control + current limit / torque limit로 간단한 force clamp
   - force/torque feedback이 있으면 **목표 힘**까지 닫고, 이후엔 힘 유지(impedance/admittance)

실전에서 bimanual에서는:
- 한 손은 “지지/고정용 (보통 더 강한 grip)”
- 다른 손은 “조작/정렬용 (상대적으로 compliant한 grip)”으로 역할을 나누는 경우가 많다.

---

## 6) Recovery loop (충돌/실패 시 어떻게 다시 조절하나?)

두 손이 모두 움직이는 bimanual에서는 “잘못 움직여 부딪히거나, 물체를 놓치는” 상황을 전제로 한 **recovery loop** 설계가 중요하다.

대표적인 단계:

1. **이상 징후 감지**
   - force/torque spike, joint torque limit hit, 비정상적인 end-effector 슬립/속도
   - 시각 기반: 물체가 손에서 벗어났거나, 예상 위치와 크게 달라진 경우
2. **즉각적인 안전 반응**
   - low-level: 힘/속도 clamp, impedance softening, 관절 속도 0에 가깝게 줄이기
   - supervisor: 현재 policy 출력을 무시하고 safe pose/retreat motion으로 전환
3. **상태 재평가**
   - “물체를 여전히 잡고 있는지” / “둘 중 어느 손에서 실패했는지” 판단
   - 필요하면 teleop로 넘겨서 human-in-the-loop로 복구
4. **재시도 정책**
   - regrasp, posture reset(팔을 더 넓게 펴고 다시 시도), 행동 파라미터(진입 각도/속도) 조정

VLA 입장에서는 “recovery까지 모두 end-to-end로 학습”하기보다,
- **이상 징후 → supervisor가 정책 출력을 잠시 차단/완화**
- **policy는 새 상태를 보고 다시 action 제안**
형태로 역할을 나누는 구조가 많이 쓰인다.

---

## 7) Minimal checklist (요약)

- [ ] bimanual이 필요한 태스크가 무엇인가? (fold/handover/align 등)
- [ ] 두 팔 workspace overlap이 충분한가?
- [ ] self-collision, workspace safety가 아키텍처에 들어갔는가?
- [ ] contact를 위한 sensing/compliance 계획이 있는가?
- [ ] 실패 감지 + recovery 루프가 있는가?

