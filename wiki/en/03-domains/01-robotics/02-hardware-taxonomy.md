# Hardware taxonomy for robotics

How to think about robot hardware from the perspective of “where and how do we put a policy/VLA?” — from platform/body form factors down to manipulation modules and their kinematics, end-effectors, sensing, actuation, and compute.

---

## 1. Platform / body form factor (top level)

View the **body** as what the manipulation module (arm/gripper) is mounted on.

- **Tabletop / fixed-base manipulator**
  - Pros: simple, safe/easy to operate, high repeatability
  - Cons: limited workspace (no mobility)

- **Mobile manipulator (robot base + arm)**
  - Meaning: arm on a mobile robot base (not a human-worn device)
  - Pros: expanded workspace, better coverage of real environments
  - Cons: localization, navigation safety, added latency and planning complexity

- **Wearable / human-worn device (exoskeleton, wearable arm)**
  - Meaning: humans move, devices assist/augment them
  - Pros: moves with the worker, potentially lower deployment friction
  - Cons: safety/ergonomics, user fatigue, UX, sensing/actuation limits

- **Humanoid (biped + 2 arms + torso/head)**
  - Pros: matches human environments (doors, drawers, shelves…), naturally bimanual
  - Cons: whole-body balance, higher system complexity, energy/safety constraints
  - In this taxonomy: focus on **selection criteria**, not deep walking/whole-body control

- **Quadruped + arm**
  - Pros: robust locomotion over rough terrain, mobility + manipulation combo
  - Cons: base motion, calibration between base/arm/sensors, safety

- **Industrial cell / workcell**
  - Pros: optimized for production lines (conveyors, tool changers, fixtures)
  - Cons: environment is well-controlled but often less general-purpose

---

## 2. Manipulation module (on top of the platform)

The module that actually performs manipulation on top of the platform.

### 2.1 Arm count / arrangement

- **Single-arm**
  - Pros: simpler, cheaper, easier to operate
  - Cons: limited for bimanual tasks (folding, complex serving/organizing)

- **Dual-arm / bimanual**
  - Pros: expands coverage to more human-like tasks (folding, organizing, serving)
  - Consider: calibration between arms, self-collision, sufficient workspace overlap

For bimanual-specific challenges and requirements, see `Bimanual` in this Robotics section.

### 2.2 Other manipulation axes (beyond arm count)

Arm count is the biggest axis, but actual manipulation performance and difficulty depend on several other axes (detailed in later sections):

- **Kinematics/DOF**: reach, redundancy, singularities → see section 3
- **End-effectors**: gripper/suction/tooling, compliance → sections 4 and 6
- **Sensing**: eye-in-hand vs external, F/T, tactile → section 5
- **Actuation & compliance**: direct-drive vs geared, impedance capability → section 6
- **Compute constraints**: on-device latency and thermal budget → section 7

---

## 3. Degrees of Freedom (DoF) & kinematics

- **Arm DoF**
  - 6DoF: reach generic poses (position 3 + orientation 3)
  - 7DoF+: **redundant** — extra DoF so multiple joint configurations can realize the same end-effector pose

### 3.1 Why 6 DoF?

An end-effector pose in 3D is typically:

- **Position (3)**: \(x, y, z\)
- **Orientation (3)**: roll / pitch / yaw (or any 3-DoF orientation representation)

To arbitrarily choose both position and orientation, we usually need **at least 6 joint DoF**, which is why 6DoF arms are a common baseline.

### 3.2 What is redundancy? (why 7+ helps)

When the arm has more DoF than needed for the pose (6), we have **kinematic redundancy**.

- **6DoF**: fewer possible joint solutions for a given pose
- **7DoF**: we can keep the same end-effector pose but move the elbow/shoulder (extra 1DoF)

This extra DoF makes the following much easier:

- avoiding obstacles/self-collision (move the elbow around)
- avoiding singularities (unstable configurations)
- staying away from joint limits while reaching
- stabilizing contact-rich tasks (align/insert/fold) with better arm posture
- reducing interference between two arms in bimanual setups

### 3.3 Kinematics essentials (FK/IK, frames, singularities)

- **FK**: joint angles \(q\) → end-effector pose \(T_{base \rightarrow ee}\)
- **IK**: target pose → feasible \(q\) (6DoF: fewer/discrete; 7DoF+: continuous families)
- **Frames**: base, world, camera, end-effector must be consistent for obs/action schemas
- **Jacobian intuition**: joint velocities → end-effector velocities; near singularities, tiny pose changes can demand large joint velocities
- **Workspace vs reach**: being able to reach a point vs fully controlling orientation at that point are different

Practical checkpoints:

- eye-in-hand cameras require solid hand–eye calibration
- if the action space is Cartesian, IK stability often dominates policy stability

---

## 4. End-effector taxonomy

- **Gripper**
  - parallel-jaw: general-purpose, simple to control
  - adaptive/compliant: absorbs error, robust under uncertainty
    - adaptive: underactuated/shape-adaptive fingers that “wrap around” diverse objects
    - compliant: hardware or impedance-based compliance to make align/insert/fold more robust
  - multi-finger: more dexterous but more complex to control and to collect data for

- **Suction**
  - strong for simple pick, limited for shaping/deformables and contact-rich manipulation

- **Tooling**
  - task-specific tools and tool-changing (spoons, tongs, etc.)

---

## 5. Sensors

- **Vision**
  - RGB / RGB-D / stereo
  - placement: eye-in-hand vs external cameras

- **Force/Torque**
  - wrist F/T sensors, gripper tactile, motor current

- **Proprioception**
  - joint encoders, velocities, torque estimates

Checkpoints:

- what feedback is needed for closed-loop control, especially contact/slip?
- how are sensors time-synchronized? (detailed in Data/Scaling)

---

## 6. Actuation & compliance

- **Actuation**
  - electric / hydraulic / pneumatic
  - direct-drive vs geared

- **Compliance**
  - hardware compliance (springs/passive) vs software compliance (impedance)

Trade-off:

- safety (force limits) vs task success in contact-rich manipulation

---

## 7. Compute & comms (hardware angle)

- **On-device compute**
  - Jetson/edge GPU/CPU/NPU
  - model size vs latency vs thermal limits

- **Connectivity**
  - wired/wireless, logging/monitoring channels

---

## 8. Minimal spec sheet template

Example table to compare platforms:

| Field | Value |
|---|---|
| Platform form factor | tabletop / mobile-manip / humanoid / quadruped+arm / workcell |
| Arm count | single / dual |
| Arm DoF | 6/7/... |
| End-effector | parallel-jaw / adaptive / multi-finger / suction |
| Sensors | RGB, depth, F/T, tactile |
| Payload / reach |  |
| Control rate |  |
| Compute |  |
| Safety | e-stop, torque limit |

---

## Food for Thought

- Platform choice is operationally painful (tabletop vs mobile vs humanoid each reshapes workspace, safety, and commissioning); productizing a shared interface + selection criteria can turn “hardware variability” into a predictable deployment path.
- Paying for richer capabilities (7DoF redundancy, F/T + tactile sensing, compliance) often raises integration and calibration complexity; if we formalize modular spec-to-requirement mapping, the added capability becomes a measurable reliability win instead of an engineering tax.
- Spec sheets are easy to write but hard to operationalize into acceptance tests; if you translate fields like reach, control rate, compute, and safety into hard product constraints, robot selection and rollout become faster and safer.

