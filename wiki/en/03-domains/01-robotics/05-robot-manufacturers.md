# Robot Hardware Reference

A catalog of robot arms, mobile manipulators, and grippers relevant to bimanual robotics research and data collection — with specs, ROS/API support, and notes on research use.

---

## Robot Arms

### ROAS PiPER (AgileX OEM)

[Product page](https://roas.co.kr/piper/) · Distributed in Korea by ROAS, manufactured by AgileX Robotics

A lightweight 6-DOF arm aimed at research and mobile manipulation. Low cost entry point; common in Korean university and startup labs.

| Spec | Value |
|------|-------|
| DOF | 6 |
| Payload | 1.5 kg |
| Reach | 626 mm |
| Repeatability | ±0.1 mm |
| Weight | 4.2 kg |
| Input Voltage | DC 24V |
| Communication | CAN |
| Body Material | Aluminum alloy + polymer shell |
| Operating Temp | −20°C to 50°C |

**Software:** Python API, ROS 1, ROS 2, drag teaching, offline trajectory

**Notes:**
- Very light (4.2 kg) — easy to mount on mobile bases
- Low payload (1.5 kg) limits gripper + object combinations
- AgileX also makes mobile bases (LIMO, Tracer) that pair naturally with PiPER

### Universal Robots UR Series

[Product page](https://www.universal-robots.com/) · Danish company, acquired by Teradyne (2015)

Industry-standard collaborative robots ("cobots"). The most widely deployed research arm globally. 6 DOF across all models; e-series adds built-in force/torque sensing.

| Model | Payload | Reach | Weight | Notes |
|-------|---------|-------|--------|-------|
| UR3e | 3 kg | 500 mm | 11.2 kg | Benchtop tasks |
| UR5e | 5 kg | 850 mm | 20.6 kg | Most common research choice |
| UR10e | 10 kg | 1,300 mm | 33.5 kg | Larger workspace |
| UR16e | 16 kg | 900 mm | 33.5 kg | High payload, compact |
| UR20 | 20 kg | 1,750 mm | 64 kg | Long reach |
| UR30 | 30 kg | 1,300 mm | 63.5 kg | Heavy payload |

**Software:** ROS / ROS 2 (official driver), Python, URScript, PolyScope UI, 1 kHz control loop

**Notes:**
- Repeatability: ±0.03 mm (e-series) — best-in-class for cobots
- Built-in wrist F/T sensing (e-series)
- Huge ecosystem: grippers, vision kits, third-party integrations
- UR5e is the default arm in many open-source robot learning datasets (RoboAgent, etc.)

### Franka Robotics FR3

[Product page](https://franka.de/research) · German company

7-DOF research arm with joint torque sensors at every joint. The de facto standard for contact-rich manipulation research. Used extensively in ACT, Diffusion Policy, and similar work.

| Spec | Value |
|------|-------|
| DOF | 7 (redundant) |
| Payload | 3 kg |
| Reach | 855 mm |
| Repeatability | < ±0.1 mm |
| Joint Torque Sensors | All 7 joints |
| Control Loop (FCI) | 1 kHz |

**Software:** Franka Control Interface (FCI) — C++, ROS 2, MATLAB/Simulink; Desk UI for rapid prototyping

**Notes:**
- Joint torque sensors enable impedance/force control and collision detection
- 7 DOF redundancy → better singularity avoidance, elbow repositioning during bimanual tasks
- **FR3 Duo**: factory-paired bimanual config on a shared base — popular for bimanual imitation learning research
- **Mobile FR3 Duo**: FR3 Duo mounted on a mobile base with onboard compute + sensors
- Actively updated via OTA (System Image 5.x series)
- Exported from Germany → may have procurement lead time for some regions

---

## Mobile Robots with Arms


### Rainbow Robotics RB-Y1

[Product page](https://www.rainbow-robotics.com/rby1) · Korean company (Rainbow Robotics, KOSDAQ-listed)

Wheeled bimanual robot with a 6-DOF "mono-leg" torso. Designed for general-purpose manipulation in human environments.

| Spec | Value |
|------|-------|
| Total DOF | 24 |
| Arms | 7 DOF × 2 |
| Torso (leg) | 6 DOF |
| Grippers | 1 DOF × 2 |
| Wheels | 1 DOF × 2 |
| Arm Payload | 3 kg (per arm) |
| Total Size | 600 × 690 × 1,400 mm (W × D × H) |
| Total Weight | 131 kg (upper 38 / lower 42 / mobile base 51) |

**Software:** Web manual, GitHub SDK, ROS support

**Notes:**
- "Mono-leg" 6-DOF torso gives unusual vertical range vs fixed-torso mobile manipulators
- 7-DOF arms with 3 kg payload → viable for real household manipulation tasks
- Korean company with local support; relevant for Korean research and startup deployments
- RB-Y1 is Rainbow's humanoid-adjacent platform; company also makes UR-compatible dual-arm systems

### Dexmate Vega

[Product page](https://www.dexmate.ai/product/vega) · Dexmate Inc., Santa Clara, CA

High-DOF mobile bimanual robot with dexterous multi-finger hands, foldable torso, and omni-directional base. Positioned as a general-purpose platform for manipulation + mobility research.

| Spec | Value |
|------|-------|
| Total DOF | 36+ |
| Arms | 13 DOF × 2 |
| Torso | 3 DOF (foldable) |
| Head | 3 DOF |
| Base | Omni-directional |
| Arm Payload | 10+ lbs (~4.5 kg) per arm |
| Max Vertical Reach | 2.2 m (7'2") when extended |
| Operation Time | 10+ hours (30+ hours no-payload) |
| Compute | NVIDIA AGX Orin (Thor upgrade planned) |

**Sensors:** RGBD + RGB cameras, LiDAR, IMU, ultrasonic, 6-axis F/T

**Software:** Python API (`pip install`), URDF/USD sim-ready, VR/exoskeleton teleoperation support, fleet management

**Notes:**
- Foldable torso is key: extends to 2.2 m for high-shelf tasks, folds for transport
- 13-DOF arm is unusually high — more dexterous than 7-DOF but harder to collect demonstrations for
- In production (lead time ~1 month as of 2026)
- Multi-finger hands + F/T sensors → suited for contact-rich dexterous tasks

---

## Grippers


### Robotiq 2F-85 / 2F-140

[Product page](https://robotiq.com/products/2f85-140-adaptive-robot-gripper) · Robotiq (Canadian)

The most common parallel-jaw gripper in robot learning research. Widely supported, simple to control, works with UR and FR3.

| Spec | 2F-85 | 2F-140 |
|------|-------|--------|
| Max Opening | 85 mm | 140 mm |
| Payload | 5 kg | 2.5 kg |
| Stroke | 85 mm | 140 mm |
| Weight | 900 g | 1,000 g |

- USB / RS-485 / Ethernet
- Robotiq grippers are used in OXE, BridgeData, and most standard research datasets
- LG전자 로봇선행연구소 uses Robotiq grippers (Robotiq black, per comms)

### Fin Ray / UMI Gripper

[UMI paper](https://arxiv.org/abs/2402.10329) · Open-source design

Compliant two-finger gripper used in UMI (Universal Manipulation Interface) for data collection. Key feature: passive compliance via Fin Ray Effect — fingers deform around object shape.

- 3D-printable fingers + coupler
- Works with standard two-finger mounts (Robotiq base coupler)
- Low cost; widely replicated after UMI paper
- Config uses Fin Ray + coupler design for teleop data collection

### Allegro Hand

[Product page](https://www.wonikrobotics.com/robot-hand) · Wonik Robotics (Korean)

16-DOF four-finger dexterous hand. Research standard for in-hand manipulation.

| Spec | Value |
|------|-------|
| DOF | 16 (4 fingers × 4 DOF) |
| Payload | ~0.3 kg |
| Communication | CAN / EtherCAT |

- ROS driver available
- High DOF → teleoperation data collection is significantly harder
- Used in dexterous manipulation research but not yet common in VLA training pipelines

---

## Comparison: Robot Arms

| | PiPER | UR5e | FR3 | FR3 Duo |
|---|---|---|---|---|
| DOF | 6 | 6 | 7 | 7 × 2 |
| Payload | 1.5 kg | 5 kg | 3 kg | 3 kg × 2 |
| Reach | 626 mm | 850 mm | 855 mm | 855 mm |
| Weight | 4.2 kg | 20.6 kg | ~18 kg | ~36 kg |
| Torque sensors | ✗ | ✗ (wrist F/T) | ✓ (all 7) | ✓ |
| Price range | ~$3K | ~$35K | ~$20K | ~$40K |
| Best for | Mobile/lightweight | General research | Contact-rich, bimanual | Bimanual imitation learning |

## Comparison: Grippers

| | Robotiq 2F-85 | Robotiq 2F-140 | Fin Ray / UMI | Allegro Hand |
|---|---|---|---|---|
| Type | Parallel jaw | Parallel jaw | Compliant 2-finger | Multi-finger (4) |
| DOF | 1 | 1 | 1 (passive) | 16 |
| Max opening | 85 mm | 140 mm | Variable | — |
| Payload | 5 kg | 2.5 kg | ~0.5 kg | ~0.3 kg |
| Weight | 900 g | 1,000 g | <100 g | ~500 g |
| Cost | ~$4K | ~$4K | <$100 | ~$15K |
| Interface | USB / RS-485 / Ethernet | USB / RS-485 / Ethernet | Mechanical | CAN / EtherCAT |
| Best for | General pick & place | Large/bulky objects | Compliant grasp, data collection | In-hand dexterous manipulation |

## Comparison: Mobile Robots

| | RB-Y1 | Dexmate Vega |
|---|---|---|
| Origin | Korea | USA |
| Arms | 7 DOF × 2 | 13 DOF × 2 |
| Payload/arm | 3 kg | ~4.5 kg |
| Torso DOF | 6 | 3 (foldable) |
| Max height | 1,400 mm | 2,200 mm |
| Total weight | 131 kg | — |
| Compute | — | AGX Orin |
| F/T sensors | — | ✓ |
| Multi-finger hand | ✗ | ✓ |
