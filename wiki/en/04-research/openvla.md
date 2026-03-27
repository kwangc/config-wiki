# OpenVLA: An Open-Source Vision-Language-Action Model

*arXiv* (OpenVLA)

---

## 1) Brief summary (public date, authors)

- **Public date:** 2024-06 (arXiv v1 posted **2024-06-13**)
- **arXiv:** [2406.09246](https://arxiv.org/abs/2406.09246)
- **Authors (representative):** Moo Jin Kim, Karl Pertsch, Siddharth Karamcheti, Ted Xiao, Ashwin Balakrishna, Suraj Nair, Rafael Rafailov, Chelsea Finn, Sergey Levine, Percy Liang (+ many co-authors)
- **GitHub:** [github.com/openvla/openvla](https://github.com/openvla/openvla)
- **HuggingFace:** [openvla/openvla-7b](https://huggingface.co/openvla/openvla-7b)

---

## 2) Detailed summary

### Core idea: open-source VLA that matches closed 55B models at 7B

RT-2 demonstrated that web-scale VLMs can be repurposed for robot control, but its weights are closed, it costs 55B parameters to run, and its training data is not public. OpenVLA asks: *can an open-source model match or exceed RT-2 at a fraction of the cost?*

OpenVLA is a fully open-source 7B-parameter VLA built on the **Prismatic VLM** backbone (SigLIP + DINOv2 vision encoders + Llama 2 7B), trained on the **Open X-Embodiment (OXE)** dataset: 970,000 robot trajectories across 22 robot embodiments and 527 skills.

### Architecture

OpenVLA uses the **Prismatic VLM** architecture:

- **Vision encoders (dual):** SigLIP (language-image pretraining) + DINOv2 (self-supervised ViT); their features are concatenated to provide richer visual representations
- **Projection:** linear layer mapping concatenated visual features into the LLM token space
- **Language model:** Llama 2 7B (decoder-only); processes visual tokens + text tokens together
- **Action prediction:** the model predicts action tokens autoregressively, exactly as it would predict text

### Action representation

Robot actions are represented as **7-dimensional vectors**:

- 6-DoF end-effector delta (Δx, Δy, Δz, Δroll, Δpitch, Δyaw)
- 1 gripper command (open/close)

Each of the 7 dimensions is **discretized into 256 bins** and mapped to a text token from the LLM's vocabulary. The model predicts these 7 tokens sequentially — the same token-based approach as RT-2, but fully open.

### Training data: Open X-Embodiment (OXE)

- **970,000 trajectories** from 22 robot embodiments
- 527 distinct skills across diverse environments
- Mix of teleoperated demonstrations, scripted policies, and human video
- Publicly available → training is fully reproducible

OpenVLA uses a carefully tuned **data mixture** to balance across embodiments and skill types — over-sampling rare skills and down-sampling over-represented ones.

### Results

**BridgeV2 benchmark** (real robot, unseen objects):

| Model | Params | Success rate |
|-------|--------|-------------|
| OpenVLA | 7B | **73.7%** |
| RT-2-X | 55B | 67.3% |
| Octo | 93M | 56.9% |

**Fine-tuning:** with LoRA, OpenVLA adapts to a new robot and task with as few as ~100 demonstrations.

### Limitations

- **Inference speed:** 7B model running on a single GPU is slower than smaller specialized models; not yet suitable for high-frequency control (>5 Hz)
- **Single-arm only:** OXE is dominated by single-arm manipulation; bimanual and mobile manipulation generalization is untested
- **No temporal context:** the model receives a single image frame per step, with no explicit history encoding

---

## 3) Why this is an important paper

- It demonstrates that **7B open-source models can outperform 55B closed models** on robot manipulation benchmarks, breaking the assumption that scale is necessary for VLA performance.
- It establishes **Open X-Embodiment as a viable training foundation** and shows how data mixture strategy (not just raw data quantity) drives performance.
- It provides a fully reproducible baseline — weights, code, and training data are all public — enabling the community to build on and study VLA behavior in detail.
- LoRA fine-tuning to new robots with ~100 demos shows a practical path to **few-shot adaptation** for Config's deployment scenarios.

---

## 4) What Config can apply

- **Open-source as a starting point:** OpenVLA-7B is a practical base model for Config's robotics work. Fine-tuning with LoRA on Config-specific robots and tasks is lower cost than training from scratch.
- **Data mixture strategy:** the OXE mixture recipe — over-sampling rare skills, down-sampling dominant embodiments — is directly applicable when Config builds its own multi-robot training set.
- **Dual vision encoder design:** using both SigLIP (language-aligned) and DINOv2 (spatial/structural) encoders provides complementary visual features. Config can evaluate whether this dual-encoder approach improves grounding for its specific manipulation tasks.
- **Benchmark design:** OpenVLA's evaluation on BridgeV2 with unseen objects is a concrete template for Config's own evaluation harness — structured, reproducible, and measuring generalization rather than in-distribution performance.
- **Inference pipeline:** the paper's throughput analysis (single GPU, ~6 Hz with optimization) gives Config a realistic budget for on-robot deployment planning.
