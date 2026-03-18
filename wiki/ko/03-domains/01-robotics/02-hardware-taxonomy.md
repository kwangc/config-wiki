# Hardware taxonomy for robotics

로봇 정책(VLA/Policy)을 “어디에 어떻게 얹을 것인가” 관점에서 **하드웨어를 분류**합니다 — 플랫폼/바디 폼팩터에서 조작 모듈(팔/그리퍼), DOF·kinematics, 엔드이펙터, 센서, 구동/컴플라이언스, 연산 제약까지.

---

## 1. Platform / body form factor (상위)

팔/그리퍼(매니퓰레이션 모듈)를 얹는 **몸통(body)** 관점의 분류입니다.

- **Tabletop / fixed-base manipulator**
  - 장점: 단순, 안전/운영 쉬움, repeatability 좋음
  - 한계: 작업공간 제한(이동 불가)

- **Mobile manipulator (robot base + arm)**
  - 의미: 사람이 착용(wearable)하는 형태가 아니라, **로봇이 이동 베이스(base)** 위에 팔을 올린 형태
  - 장점: 작업공간 확장, 실제 환경 커버리지↑
  - 고려: localization, 이동 안전, 지연(latency)과 planning 복잡도

- **Wearable / human-worn device (exoskeleton, wearable arm)**
  - 의미: 로봇이 이동하는 것이 아니라 **사람이 이동**하고, 디바이스가 사람을 보조/증강
  - 장점: 작업자와 함께 움직이며 즉시 사용 가능, 현장 도입 장벽이 낮을 수 있음
  - 고려: 안전/인체공학, 착용 피로도, 사용성(UX), 센서/액추에이션 한계

- **Humanoid (biped + 2 arms + torso/head)**
  - 장점: 인간 환경(문/서랍/선반) 호환성, 기본적으로 양팔 작업 가능
  - 비용/복잡도: 보행/전신 안정화로 시스템 복잡도↑, 에너지/안전 제약↑
  - 여기서는 “선택 기준/요구사항” 정도까지만 다루고, 보행/전신 제어 심화는 제외

- **Quadruped + arm**
  - 장점: 거친 지형/이동 안정성, 이동 + 조작 조합
  - 고려: 베이스 흔들림, 팔/센서 캘리브레이션, 안전

- **Industrial cell / workcell**
  - 장점: 컨베이어/툴 체인지 등 생산 라인 최적화
  - 고려: 환경이 잘 통제되지만 범용성은 낮을 수 있음

---

## 2. Manipulation module (하위)

플랫폼 위에 “조작”을 담당하는 모듈을 분해해서 봅니다.

### 2.1 Arm count / arrangement

- **Single-arm**
  - 장점: 단순, 비용/운영 쉬움
  - 한계: 양손 협응 태스크 제약(접기/정리/서빙의 안정성)

- **Dual-arm / bimanual**
  - 장점: 인간형 작업(접기·정리·서빙) 커버리지 확대
  - 고려: 두 팔 간 캘리브레이션, 충돌 회피, workspace overlap

### 2.2 Other manipulation axes (arm count 외 분류 축)

arm 개수는 가장 큰 축이지만, 실제 조작 성능/난이도는 아래 축들의 조합으로 결정되는 경우가 많습니다. (각 항목은 뒤 섹션에서 더 설명)

- **Kinematics/DOF**: reach, redundancy, singularity → `## 3`
- **End-effector**: gripper/suction/tooling, compliance → `## 4`, `## 6`
- **Sensing**: eye-in-hand vs external, F/T, tactile → `## 5`
- **Actuation & compliance**: direct-drive vs geared, impedance 가능성 → `## 6`
- **Compute constraints**: on-device latency/thermal budget → `## 7`

---

## 3. Degrees of Freedom (DoF) & kinematics

- **Arm DoF**
  - 6DoF: 일반적인 pose(위치 3 + 방향 3) 도달
  - 7DoF+: **redundant**(여분 자유도)로 동일 pose에서도 관절 자세 선택지가 생김

### 3.1 What is DoF? (왜 “6”인가)

End-effector의 3D pose는 보통 다음 6개로 표현됩니다.

- **Position (3)**: \(x, y, z\)
- **Orientation (3)**: roll / pitch / yaw (표현은 quaternion 등으로 바꿀 수 있지만 자유도는 3)

그래서 손끝 pose를 “원하는 대로” 만들려면 보통 **최소 6개의 자유도(관절)**가 필요하고, 이것이 6DoF 팔이 표준적으로 쓰이는 이유입니다.

### 3.2 What is redundancy? (7DoF가 주는 여유)

팔의 DoF가 손끝 pose에 필요한 6보다 크면 **kinematic redundancy(중복자유도)**가 생깁니다.

- **6DoF**: 같은 손끝 pose를 만들 수 있는 관절 해가 상대적으로 제한적
- **7DoF**: 같은 손끝 pose를 유지하면서도 팔꿈치/어깨 자세를 바꿀 수 있는 “여분(1DoF)”이 생김

이 여분 자유도는 다음을 “드라마틱하게” 쉽게 만듭니다.

- **장애물/자기충돌 회피**: 손끝은 유지하고 팔꿈치를 다른 경로로 빼기
- **특이점(singularity) 회피**: 제어가 불안정해지는 자세를 피해 다른 자세로 접근
- **관절 제한 회피**: joint limit에 붙지 않도록 편한 자세 선택
- **접촉 작업 안정성**: align/insert/fold에서 더 안정적인 자세로 힘/오차를 낮추기
- **bimanual 간섭 감소**: 두 팔 workspace 공유 시 자세 조정이 쉬움

### 3.3 Kinematics essentials (FK/IK, frames, singularity)

- **Forward kinematics (FK)**: 관절 각도 \(q\) → 손끝 pose \(T_{base \rightarrow ee}\)
- **Inverse kinematics (IK)**: 목표 손끝 pose → 가능한 \(q\) 찾기 (6DoF는 해가 제한적, 7DoF+는 redundancy로 여러 해/연속 해 가능)
- **Frames (좌표계)**: base, world, camera, end-effector 프레임이 명확해야 observation/action 일관성 확보
- **Jacobian 직관**: 관절 속도 → 손끝 속도의 선형 근사. singularity 근처에서는 작은 pose 변화에도 관절 속도가 크게 튈 수 있음
- **Workspace / reach**: “도달 가능한 공간”과 “자세(orientation)까지 포함한 도달 가능성”은 다름

실전 체크 포인트:

- eye-in-hand 카메라를 쓰면 hand-eye calibration 품질이 전체 시스템 품질을 좌우
- action space가 Cartesian이면 IK 안정성이 곧 policy 안정성으로 이어짐

---

## 4. End-effector taxonomy

- **Gripper**
  - parallel-jaw: 범용, 제어 단순
  - adaptive/compliant: 오차 흡수, 불확실성에 강함
    - adaptive: underactuated/형상 적응으로 다양한 물체를 “감싸서” 잡기 쉬움
    - compliant: 접촉 시 힘을 흡수(패시브/impedance)해 align/insert/fold 같은 작업에서 안정성↑
  - multi-finger: 정교하지만 제어·데이터 복잡

- **Suction**
  - 단순 pick에는 강하지만, “조작/접기”는 한계

- **Tooling**
  - 작업별 툴 체인지(스푼, 집게 등) 필요성

---

## 5. Sensors

- **Vision**
  - RGB / RGB-D / stereo
  - 배치: eye-in-hand vs external camera

- **Force/Torque**
  - wrist F/T 센서, 그리퍼 촉각, motor current

- **Proprioception**
  - joint encoder, velocity, torque estimate

체크 포인트:

- 폐루프 제어에 필요한 관측치(특히 접촉/미끄러짐)
- 센서 동기화(타임스탬프) — (자세한 내용은 Data/Scaling에서 다룸)

---

## 6. Actuation & compliance

- **Actuation**
  - electric / hydraulic / pneumatic
  - direct-drive vs geared

- **Compliance**
  - 하드웨어 compliance(스프링/패시브) vs 소프트웨어 compliance(impedance)

체크 포인트:

- 안전(힘 제한)과 contact-rich 조작의 성공률(접촉 안정성) 사이의 트레이드오프

---

## 7. Compute / comms (하드웨어 관점)

- **On-device compute**
  - Jetson/edge GPU/CPU/NPU
  - 모델 크기/latency/thermal 제한

- **Connectivity**
  - 유선/무선, 로깅/모니터링 경로

---

## 8. Minimal spec sheet template

실제 플랫폼 비교에 사용할 수 있는 예시:

| 항목 | 값 |
|---|---|
| Platform form factor | tabletop / mobile-manip / humanoid / quadruped+arm / workcell |
| Arm count | single / dual |
| Arm DOF | 6/7/... |
| End-effector | parallel-jaw / adaptive / multi-finger / suction |
| Sensors | RGB, depth, F/T, tactile |
| Payload / reach |  |
| Control rate |  |
| Compute |  |
| Safety | e-stop, torque limit |

---

## Food for Thought

- 플랫폼 선택 자체가 운영 비용을 크게 흔듭니다(고정형/모바일/휴머노이드는 작업공간, 안전, 커미셔닝 방식이 달라짐); 공통 인터페이스와 “선택 기준”을 제품화하면 하드웨어 변동성을 예측 가능한 배포 흐름으로 바꿀 수 있습니다.
- 7DoF redundancy, F/T·tactile 같은 풍부한 센싱, 컴플라이언스에 투자하면 보통 통합·캘리브레이션 복잡도가 같이 올라갑니다; spec을 요구사항과 모듈 단위로 엄밀히 매핑하면, 추가 역량이 신뢰성 향상의 데이터로 전환될 수 있습니다.
- spec sheet은 작성은 쉬워도 운영/검증(acceptance)으로 연결하기가 어렵습니다; reach, control rate, compute, safety 같은 항목을 “하드 제약”으로 제품화하면 로봇 선택과 롤아웃이 더 빠르고 안전해집니다.

