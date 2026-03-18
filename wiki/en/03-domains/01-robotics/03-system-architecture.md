# System architecture for robotics

How to structure a robot system so that policies/VLAs can run safely and reliably: **control stack, key interfaces, runtime modes, and safety/supervision.**

---

## Scope

- Focus: **system architecture** for running policies/VLAs on real robots
- Data/ops (collection, labeling, quality): covered in `Data & Scaling`
- Simulation/Sim2Real: covered in `Simulation`

---

## 1. Control stack (layered)

Typical layers:

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

Notes:

- Observations should represent a **single logical timestamp** as closely as possible (synchronization).
- For bimanual, left/right arm state are usually grouped into a **single tuple schema** for training/ops.

### 2.2 Action schema

- **Cartesian**: end-effector pose delta or target pose
- **Joint**: target q or dq
- **Gripper**: open/close, position/force

Policy output typically does **not** go straight to actuators. A supervisor enforces:

- action clamp (velocity/acceleration/workspace)
- self-collision proxies
- gripper force limits

### 2.3 Timing contract

- policy rate: e.g. 5–30 Hz
- low-level control rate: e.g. 200–1000 Hz
- sensor timestamps and alignment policy

Good practice: explicitly define **what happens when the policy is late**:

- last action hold vs safe stop vs fallback controller
- watchdog timeout threshold (e.g. 2× policy period)

---

## 3. Runtime modes

- **Teleop mode**: human control + data logging
- **Autonomy mode**: policy controls
- **Shadow mode**: policy inference only (no actuation)
- **Recovery mode**: fail-safe behaviors

Mode transitions are safest when handled by a **single supervisor entry point**, not scattered across components.

---

## 4. Safety & supervision

- **Hard safety**
  - e-stop, torque/velocity limits, workspace limits
- **Soft safety**
  - action clamps, collision proxies, watchdog timeouts
- **Mode gating**
  - policy output is always gated by a supervisor before it reaches actuators

In practice, **policy process** and **supervisor process** are often separated so that supervisor can guarantee safe stop even if the policy crashes.

---

## 5. Model vs system responsibilities

It’s rare to have a VLA “directly” control every parameter. Most production systems use **hierarchical responsibilities**:

- **Policy/VLA (high level)**: observation → action
  - e.g. end-effector \(\Delta\)pose/goal, gripper open/close, primitive selection
- **Supervisor/Safety (guardrails)**: single entry point for enforcing constraints
  - clamps, workspace/self-collision, watchdog, mode switching, safe stop
- **Low-level control**: high-frequency control loop
  - position/torque/impedance control
- **Estimation/Kinematics**: FK/IK, frame management, calibration

Why split responsibilities:

- different timing requirements (policy 5–30 Hz vs low-level 200–1000 Hz)
- safety cannot rely solely on a probabilistic model
- operational issues (calibration drift, sensor delays, comms) need to be absorbed by the system

### Presets & profiles (where do detailed settings live?)

With VLA producing high-level actions, **detailed settings live as presets/config in the system**.

- **Robot-specific presets (almost fixed)**
  - calibration: camera intrinsics/extrinsics, hand-eye, base/world frames
  - safety limits: workspace/velocity/torque limits, self-collision proxies
  - controller params: gains, watchdog timeout, fallback behavior
  - schemas: observation/action fields, units, frames (versioned)

- **Task/profile presets (switchable)**
  - per-task limits, speed/precision modes, gripper force profiles
  - chosen by supervisor from context, or requested by policy as “profile selection”

---

## 6. Decide early (checklist)

- action space (cartesian vs joint) + clamp strategy
- policy Hz + latency budget
- on-device inference engine (ONNX/TensorRT/…) + fallback
- calibration strategy (camera extrinsics, hand-eye)
- failure detection and recovery policy
- schema versioning (obs/action)
- config management (per-robot calibration/limits, deployment units)

---

## Food for Thought

- Control-stack timing contracts (policy 5–30Hz vs low-level 200–1000Hz) are the hidden source of instability; if we make these contracts machine-enforceable (watchdog semantics + late-action policy), we can ship robots that fail safely instead of “sometimes unsafe.”
- Safety supervision is brittle when responsibilities are split across processes/components; productizing a single supervisor entry point with explicit mode gating and testable safe-stop behaviors can turn safety from a one-off integration story into a reusable platform layer.
- Observation/action schema + preset/profile version drift silently breaks autonomy; if you treat schemas and configs as versioned product artifacts (with compatibility checks), continuous improvement becomes feasible without constant re-tuning per robot.

