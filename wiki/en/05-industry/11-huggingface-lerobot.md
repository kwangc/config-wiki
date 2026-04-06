# Hugging Face LeRobot

> Open-source robot learning library and ecosystem by Hugging Face

---

## Quick facts

- **Launched:** 2024 (public release)
- **Organization:** Hugging Face
- **Repo:** [huggingface/lerobot](https://github.com/huggingface/lerobot) (23k+ stars)
- **Key angle:** Open-source, full-stack robot learning — hardware support, policies, datasets, training, and deployment in one library

---

## What LeRobot is

LeRobot is Hugging Face's open-source framework for robot learning. It covers the full stack:

- **Hardware integrations** — SO-100/SO-101, Koch, LeKiwi, Reachy 2, Unitree G1 (humanoid), and more via a plugin system
- **Dataset infrastructure** — standardized format for collecting and sharing robot demonstrations (see [LeRobot Dataset Formats](../../03-domains/05-data-scaling/02-robot-dataset-formats/))
- **Policy zoo** — ACT, Diffusion Policy, Pi0, Pi0.5, Pi0-FAST, GR00T N1.5, SmolVLA, Wall-X, X-VLA, SARM
- **Training pipeline** — single and multi-GPU training via Accelerate, PEFT/LoRA support
- **Simulation** — LIBERO, Meta-World, NVIDIA IsaacLab-Arena, EnvHub (load sim envs from Hub)

---

## Key releases

### v0.4.0 (October 2025)
- **Dataset v3.0** — chunked file format replacing per-episode files; enables OXE-scale (400GB+) datasets and Hub-native streaming
- **Pi0 / Pi0.5** — Physical Intelligence's VLA models integrated into LeRobot
- **GR00T N1.5** — NVIDIA's 3B cross-embodiment foundation model
- **Hardware plugin system** — third-party robots/cameras as pip-installable packages
- **Processor pipeline** — modular data normalization/tokenization between robot and policy
- **Multi-GPU training** via Accelerate

### v0.5.0 (March 2026)
- **Unitree G1 humanoid** — first humanoid integration, with whole-body control (locomotion + manipulation)
- **Pi0-FAST** — autoregressive VLA using FAST action tokenization (Gemma 300M action expert)
- **Real-Time Chunking (RTC)** — inference-time technique from Physical Intelligence for responsive flow-matching policies
- **Wall-X** — Qwen2.5-VL backbone + flow-matching action head
- **X-VLA** — Florence-2 backbone VLA
- **SARM** — Stage-Aware Reward Modeling for long-horizon tasks
- **PEFT/LoRA** — fine-tune large VLAs with a fraction of compute
- **Streaming video encoding** — real-time frame encoding during recording; zero wait between episodes
- **EnvHub** — load simulation environments directly from the Hub
- **Python 3.12+ / Transformers v5** — codebase modernization
- **ICLR 2026** — LeRobot paper accepted

---

## Config context

- LeRobot is the dominant open-source benchmark for robot learning; policies and datasets released here set community baselines
- Dataset v3.0 streaming format is relevant to Config's data pipeline design (see [Robot Dataset Formats](../../03-domains/05-data-scaling/02-robot-dataset-formats/))
- Pi0/Pi0.5/GR00T N1.5 integrations mean open-source alternatives to proprietary foundation models are becoming viable; important to track for fine-tuning strategies

---

## Sources

- [GitHub: huggingface/lerobot](https://github.com/huggingface/lerobot)
- [Blog: LeRobot v0.4.0](https://huggingface.co/blog/lerobot-release-v040)
- [Blog: LeRobot v0.5.0](https://huggingface.co/blog/lerobot-release-v050)
- [Docs: LeRobotDataset v3.0](https://github.com/huggingface/lerobot/blob/main/docs/source/lerobot-dataset-v3.mdx)
