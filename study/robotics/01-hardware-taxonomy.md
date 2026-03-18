# Robotics — Hardware taxonomy (draft)

목표: 로봇을 “정책(policy)을 어디에 어떻게 얹는가” 관점에서 **하드웨어를 분류**하고, 각 선택이 데이터/배포/성능에 주는 제약을 빠르게 파악한다.

---

## 0) Scope

- 여기서는 **Hardware taxonomy**만 다룸
- 데이터/운영: `Data & Scaling`에서 별도 정리
- Sim2Real: `Simulation`에서 별도 정리

---

## 1) Platform / body form factor (상위)

팔/그리퍼(매니퓰레이션 모듈)를 얹는 “몸통(body)” 관점의 분류.

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
  - taxonomy 범위: 여기서는 “선택 기준/요구사항”만 다루고 보행/전신 제어 심화는 제외
- **Quadruped + arm**
  - 장점: 거친 지형/이동 안정성, 이동 + 조작 조합
  - 고려: 베이스 흔들림, 팔/센서 캘리브레이션, 안전
- **Industrial cell / workcell**
  - 장점: 컨베이어/툴 체인지 등 생산 라인 최적화
  - 고려: 환경이 잘 통제되지만 범용성은 낮을 수 있음

---

## 2) Manipulation module (하위)

플랫폼 위에 “조작”을 담당하는 모듈을 분해해서 본다.

### 2.1 Arm count / arrangement

- **Single-arm**
  - 장점: 단순, 비용/운영 쉬움
  - 한계: 양손 협응 태스크 제약(접기/정리/서빙의 안정성)
- **Dual-arm / bimanual**
  - 장점: 인간형 작업(접기·정리·서빙) 커버리지 확대
  - 고려: 두 팔 간 캘리브레이션, 충돌 회피, workspace overlap

→ bimanual 난이도/요구사항은 `study/robotics/03-bimanual.md`에서 별도 정리.

### 2.2 Other manipulation axes (arm count 외 분류 축)

arm 개수는 가장 큰 축이지만, 실제 조작 성능/난이도는 아래 축들의 조합으로 결정되는 경우가 많다. (각 항목은 뒤 섹션에서 더 설명)

- **Kinematics/DOF**: reach, redundancy, singularity → `## 3`
- **End-effector**: gripper/suction/tooling, compliance → `## 4`, `## 6`
- **Sensing**: eye-in-hand vs external, F/T, tactile → `## 5`
- **Actuation & compliance**: direct-drive vs geared, impedance 가능성 → `## 6`
- **Compute constraints**: on-device latency/thermal budget → `## 7`

---

## 3) Degrees of Freedom (DOF) & kinematics

- **Arm DOF**
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

Kinematics는 “관절이 어떻게 움직이면 손끝이 어디로 가는가”를 다룹니다. 학습/제어/배포에서 다음 개념들이 반복해서 등장합니다.

- **Forward kinematics (FK)**: 관절 각도 \(q\) → 손끝 pose \(T_{base \rightarrow ee}\)
- **Inverse kinematics (IK)**: 목표 손끝 pose → 가능한 \(q\) 찾기 (6DoF는 해가 제한적, 7DoF+는 redundancy로 여러 해/연속 해가 가능)
- **Frames (좌표계)**: base, world, camera, end-effector 프레임이 명확해야 observation/action이 일관됨
- **Jacobian 직관**: 관절 속도 → 손끝 속도의 선형 근사. singularity 근처에선 작은 손끝 움직임에도 관절 속도가 “폭발”할 수 있음
- **Workspace / reach**: “도달 가능한 공간”과 “자세(orientation)까지 포함한 도달 가능성”은 다름

실전 체크 포인트
- eye-in-hand 카메라를 쓰면 hand-eye calibration이 시스템 품질을 좌우
- action space가 Cartesian이면 IK 안정성이 곧 policy 안정성으로 이어짐
- **Gripper / end-effector DOF**
  - parallel jaw (1DOF) / multi-finger(>10DOF) / suction
- **Kinematic chain**
  - 링크 길이/관절 배치가 **workspace**, **singularity 빈도/위치**, **힘/강성(lever arm)**에 영향
  - 팔꿈치가 “어느 쪽으로 빠지는가(elbow-up/down)” 같은 redundancy 방향성이 충돌 회피에 중요

체크 포인트
- 작업 대상의 크기/공간 제약(선반, 테이블, 좁은 공간)
- 양손 협응 필요 여부(한 손 고정 + 다른 손 조작)

---

## 4) End-effector taxonomy

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

## 5) Sensors

- **Vision**
  - RGB / RGB-D / stereo
  - 배치: eye-in-hand vs external camera
- **Force/Torque**
  - wrist F/T 센서, 그리퍼 촉각, motor current
- **Proprioception**
  - joint encoder, velocity, torque estimate

체크 포인트
- 폐루프 제어에 필요한 관측치(특히 접촉/미끄러짐)
- 센서 동기화(타임스탬프) — (데이터 섹션에서 자세히)

---

## 6) Actuation & compliance

- **Actuation**
  - electric / hydraulic / pneumatic
  - direct-drive vs geared
- **Compliance**
  - 하드웨어 compliance(스프링/패시브) vs 소프트웨어 compliance(impedance)

체크 포인트
- 안전(힘 제한)과 작업 성공률(접촉 안정성)의 트레이드오프

---

## 7) Compute / comms (하드웨어 관점)

- **On-device compute**
  - Jetson/edge GPU/CPU/NPU
  - 모델 크기/latency/thermal 제한
- **Connectivity**
  - 유선/무선, 로깅/모니터링 경로

---

## 8) Minimal spec sheet template

아래 표를 “실제 플랫폼 비교”에 사용.

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

