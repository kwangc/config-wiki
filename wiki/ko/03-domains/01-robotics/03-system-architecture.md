# System architecture for robotics

Policy/VLA를 실제 로봇 시스템 위에서 **안전하고 안정적으로 돌리기 위한 아키텍처**를 정리합니다: control stack, key interfaces, runtime modes, safety/supervision.

---

## 범위

- 초점: **system architecture** (정책/VLA 위주)
- 데이터 파이프라인(수집/라벨링/품질): `Data & Scaling`에서 별도 정리
- Simulation/Sim2Real: `Simulation`에서 별도 정리

---

## 1. Control stack (layered)

일반적으로 아래와 같이 층을 나눕니다.

1. **Hardware drivers**
   - joint/gripper IO, sensor drivers
2. **Low-level control**
   - position/velocity/torque control, impedance control
3. **State estimation**
   - kinematics, camera extrinsics, optional filtering
4. **Policy interface**
   - observation → action (VLA / policy / planner)
5. **Supervision & safety**
   - e-stop, limiters, watchdog, mode switching
6. **Runtime services**
   - logging, metrics, replay, config/versioning

---

## 2. Key interfaces

### 2.1 Observation schema

- camera frames (RGB/RGB-D), intrinsics/extrinsics
- robot state (q, dq, optionally torque)
- gripper state
- optional: force/torque, tactile

메모:

- 한 번의 inference에서 사용하는 관측은 **가능한 한 한 시점(timestamp)**을 잘 근사하도록 동기화하는 것이 중요합니다.
- bimanual인 경우 left/right arm state를 하나의 **tuple schema**로 묶어두면 학습/운영 모두에서 편합니다.

### 2.2 Action schema

- **Cartesian**: end-effector pose delta 또는 target pose
- **Joint**: target q 또는 dq
- **Gripper**: open/close, position/force

정책 출력은 보통 **그대로 actuator로 가지 않고**, supervisor에서 다음을 거칩니다.

- action clamp (속도/가속/워크스페이스)
- self-collision proxy
- gripper force limit

### 2.3 Timing contract

- policy rate: 예) 5–30 Hz
- low-level control rate: 예) 200–1000 Hz
- sensor timestamps와 alignment 정책

권장: “정책이 늦을 때 어떻게 할지”를 **계약으로 명시**해 둡니다.

- last action hold vs safe stop vs fallback controller
- watchdog timeout 기준(예: policy period의 2배)

---

## 3. Runtime modes

- **Teleop mode**: human control + data logging
- **Autonomy mode**: policy controls
- **Shadow mode**: policy inference only (no actuation)
- **Recovery mode**: fail-safe behaviors

모드 전환은 supervisor가 **단일 진입점(single entry point)**으로 관리하는 편이 가장 안전합니다.

---

## 4. Safety & supervision

- **Hard safety**
  - e-stop, torque/velocity limits, workspace limits
- **Soft safety**
  - action clamps, collision proxies, watchdog timeouts
- **Mode gating**
  - policy output은 항상 supervisor를 통해 actuator로 전달되도록 강제

실제 구현에서는 **policy 프로세스**와 **supervisor 프로세스**를 분리해서, policy가 죽거나 멈추더라도 supervisor가 안전정지를 보장하도록 두는 경우가 많습니다.

---

## 5. Model vs system responsibilities

컨트롤할 요소가 많다고 해서 VLA가 “모든 파라미터를 직접 제어”하는 구조로 가는 경우는 드뭅니다. 실제 시스템에서는 보통 **계층형 분업**을 둡니다.

- **Policy/VLA (상위)**: observation → action
  - 예: end-effector \(\Delta\)pose/goal, gripper open/close, primitive 선택
- **Supervisor/Safety (가드레일)**: 제약/안전을 enforcement하는 단일 진입점
  - clamp, workspace/self-collision, watchdog, 모드 전환, safe stop
- **Low-level control**: 고주기 제어 루프
  - position/torque/impedance control
- **Estimation/Kinematics**: FK/IK, frame 관리, calibration 반영

왜 이렇게 나누나?

- 타이밍 요구가 다름 (policy 5–30 Hz vs low-level 200–1000 Hz)
- 안전을 확률적 모델에만 맡기기 어려움
- calibration drift, 센서 지연, 통신 문제 등 운영 이슈를 시스템이 흡수해야 함

### Presets & profiles (세부 세팅은 어디에 두나)

VLA가 high-level 행동을 내는 구조에서는 “세부 세팅”은 시스템에 **preset/config**로 들어가 있어야 합니다.

- **로봇별 preset (고정에 가까움)**
  - 캘리브레이션: camera intrinsics/extrinsics, hand-eye, base/world frames
  - 안전 한계: workspace/velocity/torque limits, self-collision proxies
  - 컨트롤러 파라미터: gains(impedance/position), watchdog timeout, fallback behavior
  - schema 정의: observation/action 필드, 단위, 좌표계(버전 관리)

- **task/profile preset (상황별로 전환)**
  - 서빙/접기/정리 등 작업별 limit, 속도/정밀 모드, gripper force profile
  - supervisor가 context로 선택하거나, policy가 “profile 선택”을 요청하는 형태가 현실적

---

## 6. Decide early (checklist)

- action space (cartesian vs joint) + clamp 전략
- policy Hz + latency budget
- on-device inference engine (ONNX/TensorRT/…) + fallback
- calibration strategy (camera extrinsics, hand-eye)
- failure detection and recovery policy
- observation/action schema 버전 관리
- 로봇별 calibration/limit, 배포 단위(arm serial, rig id)에 대한 config 관리

---

## Food for Thought

- control stack의 timing contract(policy 5–30Hz vs low-level 200–1000Hz)는 안정성의 “숨은” 원인입니다; 이 계약을 watchdog/late-action 정책처럼 기계적으로 강제하면, 로봇이 실패해도 항상 안전하게 멈추는 제품을 만들 수 있습니다.
- safety가 policy 프로세스/컴포넌트 분할 때문에 깨지기 쉬운데, “단일 supervisor entry point”를 제품화(모드 gating + safe-stop 테스트 가능화)하면 안전을 매번 새로 통합하는 비용 대신 재사용 플랫폼 계층으로 바꿀 수 있습니다.
- observation/action 스키마와 preset/profile의 버전 드리프트는 자주 조용히 망가집니다; 스키마/컨피그를 버전 아티팩트로 취급하고 호환성 검사를 넣으면, 매 로봇마다 재튜닝 없이도 반복 개선이 가능해집니다.

