# Bimanual manipulation

왜 bimanual(두 손)이 중요한지, 무엇이 어렵고, 그 난이도가 **하드웨어**와 **시스템 아키텍처**에 어떤 요구사항을 만드는지 정리합니다.

---

## 왜 bimanual인가?

실세계의 많은 작업은 “두 손 역할 분담”이 자연스럽게 포함됩니다.

- **고정 + 조작**: 한 손은 지지/고정, 다른 손은 조작
- **잡기 + 정렬/삽입**: 조립/정렬/끼우기
- **접기/형상 변화**: 수건/의류 접기 같은 deformable
- **handover / regrasp**: 그립을 바꾸기 위한 손-손 전달

---

## 핵심 난이도

- **협응**: 역할 분해(지지 vs 조작)와 역할 전환, 자기충돌 방지
- **접촉이 많음(contact-rich)**: 순응성 + 피드백이 중요
- **관측 불완전**: 가림(occlusion) 때문에 시각만으로 부족할 수 있음
- **안전/복구**: 정지-복구-재시도 루프 설계가 필요

---

## 하드웨어 관점 시사점

- **workspace overlap**: handover/regrasp를 위해 두 팔 작업영역이 충분히 겹쳐야 함
- **엔드이펙터**: 접기/정렬에는 compliant/adaptive gripper가 유리한 경우가 많음(흡착은 형상 변화에 한계)
- **센싱**: proprioception + 안정적인 vision이 기본, wrist F/T·tactile은 큰 도움
- **순응성(compliance)**: 패시브 또는 impedance 제어로 brittleness 감소

---

## 아키텍처 관점 시사점

- **Obs/Action 스키마**: 두 팔 action을 joint tuple로 다루거나 supervisor가 조율
- **타이밍 계약**: policy Hz vs low-level Hz, latency budget
- **감시(supervision)**: workspace limit, self-collision avoidance, action clamp, mode gating
- **recovery**: slip/drop/contact failure 감지 후 재시도 (아래 recovery loop 참고)

---

## Grip force control (그립 강도 조절)

실무에서는 크게 두 레벨로 나눠볼 수 있습니다.

- **Preset/profile 레벨**: 물체/태스크별로 soft / normal / firm 같은 force profile을 시스템에 정의
- **제어 레벨**: position control + current/torque limit, 또는 힘 피드백(F/T, motor current 등)을 사용해 목표 힘까지 닫은 뒤 힘 유지(impedance/admittance)

bimanual에서는 보통:

- 한 손은 **지지/고정용**(더 강한 grip)
- 다른 손은 **조작/정렬용**(상대적으로 compliant한 grip)으로 역할을 나누는 패턴이 많습니다.

---

## Recovery loop (충돌/실패 시 루프)

두 손이 모두 움직이는 상황에서는 “잘못 움직이거나 부딪혀서 실패하는 것”을 전제로 한 recovery loop 설계가 중요합니다.

대표적인 단계:

1. **이상 징후 감지**
   - force/torque spike, joint torque limit hit, 비정상적인 end-effector 슬립/속도
   - 시각 기반: 물체가 손에서 벗어나거나 예상 위치와 크게 달라진 경우
2. **즉각적인 안전 반응**
   - low-level: 힘/속도 clamp, impedance softening, 속도 거의 0으로 줄이기
   - supervisor: 현재 policy 출력을 무시하고 safe pose/retreat motion으로 전환
3. **상태 재평가**
   - 여전히 물체를 잡고 있는지, 어느 손에서 실패했는지 판단
   - 필요시 teleop로 넘겨 human-in-the-loop 복구
4. **재시도 전략**
   - regrasp, 자세 리셋(팔을 넓게 펴고 다시 접근), 진입 각도/속도 조정

실전에서는 “recovery까지 모두 end-to-end로 모델에 맡기기”보다는,
- **이상 징후 시 supervisor가 즉시 안전 반응을 수행**하고,
- 그 이후 상태를 기반으로 VLA/policy가 다시 action을 제안하는 구조가 많이 쓰입니다.

---

## Study 노트

- `../../../../study/robotics/03-bimanual.md`

---

## Food for Thought

- bimanual에서 협응(역할 분담/전환 + 자기충돌 회피)은 “대체로 되지만 특정 상황에서만 깨지는” 실패가 잦습니다; 역할 기반 스키마와 충돌/안전 프록시를 제품화하면 자율성 확장에 바로 연결됩니다.
- contact-rich 작업은 순응성 + 피드백(그리고 가림 때문에 불완전한 관측)을 동시에 만족해야 하는데, 이 조합이 까다롭습니다; wrist F/T·tactile 같은 센싱과 compliant 하드웨어를 검증 가능한 지표로 묶으면, 안정성을 ‘증명’하는 기회가 생깁니다.
- recovery loop는 end-to-end 학습으로 해결하기 어렵고, 실무에서는 supervisor가 즉시 안전 반응을 수행한 뒤 복구된 상태에서 policy가 다시 제안하는 구조가 효과적입니다; 이 패턴을 템플릿/툴로 만들면 실패율과 운영 비용을 같이 줄일 수 있습니다.

