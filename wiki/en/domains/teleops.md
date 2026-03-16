# Teleoperation (teleop)

Collecting high-quality robot demonstrations by **having humans control the robot**.

---

## Why teleop?

For robot & VLA training:

- **Random RL in the real world is expensive and risky.**
- Human demos give a strong prior about *how* to solve tasks.

Typical pipeline:

1. Collect demos with teleop
2. Train an initial policy with Behavior Cloning (BC)
3. Optionally fine-tune with RL (PPO, etc.)

---

## What to log (minimum schema)

Per timestep $t$:

- **State** $s_t$
  - Observations: image/video $I_t$ (single/multi-view)
  - Robot proprioception: joint positions $q_t$, velocities $\dot{q}_t$, gripper state
  - (Optional) end-effector pose $\mathbf{x}_t$ (position + orientation)
  - (Optional) forces/torques, tactile, depth/point cloud
  - (Optional) language instruction $u$ (often per-episode)
- **Action** $a_t$
  - Joint command (torque/velocity), or
  - End-effector delta $\Delta \mathbf{x}_t$ + gripper command
- **Timestamp** $t$ or $\Delta t$ (critical for sync)

Conceptually:

$$
(u,\; I_t,\; \mathbf{r}_t)\;\rightarrow\; a_t
$$

where $\mathbf{r}_t$ bundles robot state (joints, grippers, EE pose, …).

---

## Data quality checklist

- **Sync**: images and actions aligned in time (low control lag)
- **Action representation**: joint-space vs EE-space — consistent with control stack
- **Noise / jitter**: hand tremor in actions — smooth where needed
- **Success / failure labels**: per-episode outcome and failure reasons
- **Reset / initial state diversity**: avoid overfitting to a single start configuration

---

## Bimanual teleop gotchas

For two-handed tasks (e.g., filling a cup with popcorn):

- Left hand: stabilize (hold cup, maintain pose)
- Right hand: manipulate (scoop, move, pour)

This role split should be reflected in:

- How actions are logged (`action_left`, `action_right`)
- How the policy/action heads are structured later

---

## See also

- [Behavior Cloning](behavior-cloning.md)
- [Robotics](robotics.md)
- [Data & Scaling](data-scaling.md)
