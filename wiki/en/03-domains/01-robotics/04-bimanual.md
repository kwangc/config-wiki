# Bimanual manipulation

Why bimanual matters, what makes it hard, and what it implies for **hardware** and **system architecture**.

---

## Why bimanual?

Many real-world tasks are naturally **two-hand**:

- **Stabilize + manipulate** (support with one hand, act with the other)
- **Hold + align/insert** (assembly, alignment)
- **Fold/shape** (towel/clothes folding, deformables)
- **Handover / regrasp** (changing grasp to continue a task)

---

## Core challenges

- **Coordination**: role assignment (supporting vs acting), role switching, self-collision
- **Contact-rich dynamics**: compliance + feedback are critical
- **Partial observability**: occlusion; vision alone may be insufficient
- **Safety & recovery**: stop/recover/retry loop must exist

---

## Implications for hardware taxonomy

- **Workspace overlap**: required for handover/regrasp
- **End-effectors**: adaptive/compliant grippers help with alignment/folding; suction is limited for shaping tasks
- **Sensing**: proprioception + stable vision; wrist F/T and tactile are strong multipliers
- **Compliance**: passive or impedance control reduces brittleness

---

## Implications for system architecture

- **Observation/action schema**: treat bimanual action as a joint tuple, or supervise single-arm outputs
- **Timing contract**: policy Hz vs low-level control Hz; latency budgets matter more under contact
- **Supervision**: workspace limits, self-collision avoidance, action clamps, mode gating
- **Recovery**: detect slip/drop/contact failure and retry (see recovery loop below)

---

## Grip force control

Two practical levels:

- **Presets/profiles**: per-object or per-task grip profiles (soft / normal / firm), defined in the system
- **Control**: position control with current/torque limits, or target-force controllers using F/T or motor current

In bimanual settings:

- one hand often serves as **support/stabilizer** (stronger grip)
- the other as **manipulator** (more compliant grip) for alignment and fine motion

---

## Recovery loop (when things go wrong)

Typical stages:

1. **Anomaly detection**
   - force/torque spikes, joint torque limits, abnormal slip/velocity
   - visual signals: object leaving the hand, large pose deviation
2. **Immediate safety reaction**
   - low-level: clamp forces/velocities, soften impedance, slow down
   - supervisor: ignore current policy outputs and switch to safe pose/retreat
3. **State re-evaluation**
   - still holding the object? which hand failed?
   - optionally hand over control to teleop (human-in-the-loop) for recovery
4. **Retry strategy**
   - regrasp, posture reset (open elbows, re-approach), adjust approach angle/speed

In practice, it’s common to let the **supervisor handle immediate safety reactions** and let the VLA/policy propose new actions based on the recovered state, instead of trying to learn the entire recovery loop end-to-end in one model.

---

## Study notes

- `../../../../study/robotics/03-bimanual.md`

---

## Food for Thought

- bimanual에서 협응(역할 분담/전환 + self-collision)은 “잘 되는데도 가끔 사고 나는” 유형의 실패를 만들기 쉽습니다; 역할 기반 action 스키마와 충돌 프록시를 제품화하면, 자율성이 더 높은 단계로 올라갈 여지가 생깁니다.
- contact-rich 작업은 센싱/순응성/피드백이 동시에 맞아야 성공률이 나오는데, 가림(occlusion) 때문에 관측이 불완전합니다; 추가 센싱(F/T, tactile)과 compliant hardware를 “검증 가능한 지표”로 묶으면, 안정성을 데이터로 증명하는 기회가 됩니다.
- recovery loop는 end-to-end 학습으로 해결하기 어렵고, 운영에서는 supervisor가 즉시 안전 반응을 하고 이후 상태를 기반으로 다시 action을 제안하는 방식이 현실적입니다; 이 패턴을 템플릿/툴링으로 만들면 실패 빈도를 크게 낮추면서 운영 비용을 줄일 수 있습니다.

