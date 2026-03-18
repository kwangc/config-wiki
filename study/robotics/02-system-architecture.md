# Robotics — System architecture (draft)

목표: 로봇 정책(Policy/VLA)을 “실제 시스템”으로 올릴 때 필요한 **구성요소/인터페이스/루프**를 한 장으로 정리한다.

---

## 0) Scope

- 여기서는 **system architecture** 중심
- 데이터 파이프라인(수집/라벨링/품질)은 `Data & Scaling`으로 분리
- Sim2Real/시뮬 레이어는 `Simulation`으로 분리

---

## 1) Control stack (layered)

일반적으로 아래처럼 층을 나눈다.

1. **Hardware drivers**
   - joint-level IO, gripper IO, sensor drivers
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

## 2) Key interfaces (what must be defined)

### Observation schema
- camera frames (RGB/RGB-D), intrinsics/extrinsics
- robot state (q, dq, optionally torque)
- gripper state
- optional: force/torque, tactile

실전에서는 “모델 입력”을 1회 inference에 필요한 단위로 고정해두는 게 중요합니다.

- **필수 원칙**: observation은 timestamp 기준으로 “동일 시점”을 최대한 근사(동기화)해야 함
- **bimanual**: left/right arm state를 동일한 schema로 묶어 tuple로 다루는 편이 운영/학습에 유리

### Action schema
- **Cartesian**: end-effector pose delta / target pose
- **Joint**: target q / dq
- **Gripper**: open/close, position/force

정책 출력은 보통 “바로 actuator”로 보내지 않고, supervisor가 아래를 적용합니다.
- action clamp (속도/가속/워크스페이스)
- self-collision proxy
- gripper force limit

### Timing contract
- policy rate (e.g. 5–30 Hz)
- low-level control rate (e.g. 200–1000 Hz)
- sensor timestamps and alignment policy

권장: “정책이 늦을 때 어떻게 할지”를 계약으로 명시합니다.
- last action hold vs safe stop vs fallback controller
- watchdog timeout 기준(예: 2× policy period)

---

## 3) Runtime modes

- **Teleop mode**: human control + data logging
- **Autonomy mode**: policy controls
- **Shadow mode**: policy inference only (no actuation)
- **Recovery mode**: fail-safe behaviors

모드 전환은 supervisor가 단일 진입점(single entry point)으로 관리하는 편이 안전합니다.

---

## 4) Safety & supervision (architecture-only)

- **Hard safety**: e-stop, torque/velocity limits, workspace limits
- **Soft safety**: action clamp, collision proxies, watchdog timeouts
- **Mode gating**: “policy output”가 바로 actuator로 가지 않고 supervisor를 통과

실제 구현에서는 “policy process”와 “supervisor process”를 분리해,
policy가 죽어도 supervisor가 안전정지를 보장하도록 구성하는 경우가 많습니다.

---

## 5) Reference architecture diagram (text)

```text
Sensors ─┐
         ├─> State/Obs Builder ─> Policy/VLA ─> Supervisor ─> Low-level ctrl ─> Actuators
Robot ───┘                      (optional planner)          (impedance/pos)

                     └────────────── Logging / Metrics / Replay ───────────────┘
```

---

## 6) Model vs system responsibilities (VLA는 어디까지 맡나)

컨트롤할 요소가 많다고 해서 “VLA가 모든 파라미터를 직접 제어”하는 구조로 가는 경우는 드뭅니다. 보통은 **계층형 분업**을 둡니다.

- **Policy/VLA (상위)**: 관측 → 행동 생성  
  - 예: end-effector \(\Delta\)pose / goal, gripper open/close, 또는 primitive 선택
- **Supervisor/Safety (가드레일)**: 행동을 안전/제약 하에서 통과시키는 단일 진입점  
  - action clamp, workspace/self-collision, watchdog, 모드 전환, safe stop
- **Low-level control (하위)**: 고주기(200–1000Hz) 제어 루프  
  - position/torque/impedance control
- **Estimation/Kinematics**: FK/IK, frame 관리, calibration 반영

왜 이렇게 나누나
- **타이밍 요구가 다름**: policy는 5–30Hz, 하위 제어는 200–1000Hz가 흔함
- **안전은 확률 모델에만 의존하기 어려움**: supervisor가 실패/지연/크래시에도 안전정지 보장
- **운영 이슈**(캘리브레이션/센서 지연/통신 문제)를 시스템이 흡수해야 함

### Presets & profiles (세부 세팅은 어디에 두나)

VLA가 high-level 행동을 내는 구조라면, “세부 세팅”은 시스템에 **preset/config**로 들어가 있어야 안정적으로 운영됩니다. 다만 보통은 아래처럼 **고정값 vs 프로파일**로 나눕니다.

- **로봇별 preset (고정에 가까움)**
  - 캘리브레이션: camera intrinsics/extrinsics, hand-eye, base/world frames
  - 안전 한계: workspace/velocity/torque limits, self-collision proxy
  - 컨트롤러 파라미터: gains(impedance/position), watchdog timeout, fallback behavior
  - schema: observation/action 필드 정의, 단위, 좌표계(버전 관리)

- **task/profile preset (상황별로 전환)**
  - 서빙/접기/정리 같은 작업별 limit, 속도/정밀 모드, gripper force profile
  - supervisor가 context로 선택하거나, policy가 “profile 선택”을 요청하는 형태가 현실적

---

## 7) What to decide early (checklist)

- action space (cartesian vs joint) + safety clamp strategy
- policy Hz + latency budget
- on-device inference engine choice(ONNX/TensorRT 등) + fallback
- calibration strategy (camera extrinsics, hand-eye)
- failure detection and recovery policy

추가로, 문서/운영 관점에서 아래도 초기에 고정하면 뒤가 편합니다.
- observation/action schema 버전 관리 (v1, v2…)
- config 관리(로봇별 캘리브레이션/limit)와 배포 단위(arm serial, rig id)

