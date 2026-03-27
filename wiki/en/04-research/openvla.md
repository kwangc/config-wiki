# OpenVLA: An Open-Source Vision-Language-Action Model

> **Published:** 2024-06-13 · arXiv [2406.09246](https://arxiv.org/abs/2406.09246)
> **Authors:** Moo Jin Kim, Karl Pertsch, Siddharth Karamcheti, Ted Xiao, Ashwin Balakrishna, Suraj Nair, Rafael Rafailov, Ethan Foster, Grace Lam, Pannag Sanketi, Quan Vuong, Thomas Kollar, Benjamin Burchfiel, Russ Tedrake, Dorsa Sadigh, Sergey Levine, Percy Liang, Chelsea Finn
> **Resources:** [GitHub](https://github.com/openvla/openvla) · [HuggingFace](https://huggingface.co/openvla/openvla-7b)

---

## Brief summary

OpenVLA is a fully open-source 7B-parameter VLA model that demonstrates frontier-level robot manipulation performance while being significantly smaller and cheaper to run than prior closed models (RT-2 is 55B parameters). It is built on top of the **Prismatic VLM** backbone (SigLIP + DINOv2 vision encoders + Llama 2 7B language model), trained on the **Open X-Embodiment (OXE)** dataset: 970,000 robot trajectories across 22 robot embodiments and 527 skills.

The key insight: by training a strong open VLM backbone on diverse, large-scale robot data, a 7B model can match or exceed a 55B closed model — and can be fine-tuned to new robots and tasks with as few as ~100 demonstrations using LoRA.

---

## Detailed summary

### Problem

Prior VLA models (RT-2) demonstrated that web-scale VLMs can be repurposed for robot control, but:
- Weights are closed (not publicly released)
- 55B parameters → expensive to run, fine-tune, or study
- Training data not public → hard to understand failure modes
- Difficult for the community to build on

### Architecture

OpenVLA is built on the **Prismatic VLM** architecture:

- **Vision encoders (dual)**: SigLIP (language-image pretraining) + DINOv2 (self-supervised ViT); their features are concatenated to provide richer visual representations
- **Projection**: linear layer mapping concatenated visual features into the LLM token space
- **Language model**: Llama 2 7B (decoder-only); processes visual tokens + text tokens together
- **Action prediction**: model predicts the next token autoregressively, including action tokens

### Action representation

Robot actions are represented as **7-dimensional vectors**:
- 6-DoF end-effector delta (Δx, Δy, Δz, Δroll, Δpitch, Δyaw)
- 1 gripper command (open/close)

Each of the 7 dimensions is **discretized into 256 bins** and represented as a text token from the LLM's vocabulary. The model predicts these 7 tokens sequentially, just as it would predict any text.

This is the same token-based approach as RT-2, but with a fully open implementation.

### Training data: Open X-Embodiment (OXE)

- **970,000 trajectories** from 22 robot embodiments
- Covers 527 distinct skills across diverse environments
- Mixture of teleoperated demonstrations, scripted policies, and human video
- Dataset is publicly available → training is reproducible

OpenVLA uses a carefully tuned **data mixture** to balance across embodiments and skill types — over-sampling rare skills and down-sampling over-represented ones.

### Results

**BridgeV2 benchmark** (real robot, unseen objects):
- OpenVLA (7B): 73.7% success rate
- RT-2-X (55B): 67.3% success rate

**Google Robot benchmark** (tabletop manipulation):
- OpenVLA (7B): comparable to RT-2-X with 7× fewer parameters

**Key finding**: A well-trained 7B open model outperforms a 55B closed model when trained on the same diverse dataset.

### Fine-tuning with LoRA

OpenVLA can be adapted to new robots and tasks efficiently:
- **LoRA (Low-Rank Adaptation)**: freeze most parameters, train only low-rank adapters
- With ~100 demonstrations of a new task, OpenVLA achieves strong performance on that task
- Fine-tuning a 7B model on a single GPU takes hours, not days

This dramatically lowers the barrier for deploying VLAs on custom hardware or new task domains.

### Limitations

- **Inference speed**: 7B model runs at ~6 Hz on an A100 — faster than 55B RT-2, but still limited for high-frequency control
- **Single-image input**: processes one camera frame at a time; no built-in temporal modeling across frames
- **Fixed action space**: designed for 7-DoF manipulation; adapting to different action spaces (e.g. bimanual, mobile) requires architectural changes
- **Distribution shift**: still fails on scenes or objects far outside the training distribution

---

## Why this matters

OpenVLA shifted the VLA landscape by showing that **open + diverse data + right-sized model** can beat closed + scaled approaches. It established:

1. The community can now build, study, and improve VLAs — not just use closed APIs
2. Data diversity matters more than model size at this scale
3. Fine-tuning is practical: ~100 demos + LoRA → deployable on new hardware

---

## Config application

- **Benchmark baseline**: OpenVLA is now the standard open-source reference for VLA comparisons
- **Fine-tuning path**: LoRA fine-tuning on ~100 demos is the practical template for adapting to new embodiments
- **Action tokenization**: the 7-DoF → 256-bin discretization approach is a proven design choice for action representation
- **Data strategy**: OXE mixture rationale directly informs how to build and balance diverse training corpora
- **Bimanual scaling**: OpenVLA's single-arm setup is the starting point; extending to 14-DoF bimanual requires rethinking the action representation and coordination structure

---

## See also

- [RT-2](./rt-2.md/) — the closed-source predecessor
- [VLA](../03-domains/02-model-class/05-vla.md/) — VLA architecture overview
- [VLM](../03-domains/02-model-class/04-vlm.md/) — VLM foundations
