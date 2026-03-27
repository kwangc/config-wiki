# Diffusion Policy: Visuomotor Policy Learning via Action Diffusion

*arXiv / RSS 2023* (Diffusion Policy)

---

## 1) Brief summary (public date, authors)

- **Public date:** 2023-03 (arXiv v1 posted **2023-03-07**; RSS 2023)
- **Main link:** [diffusion-policy.cs.columbia.edu](https://diffusion-policy.cs.columbia.edu/)
- **arXiv:** [2303.04137](https://arxiv.org/abs/2303.04137)
- **Authors (representative):** Cheng Chi, Siyuan Feng, Yilun Du, Zhenjia Xu, Eric Cousineau, Benjamin Peng, Shuran Song (Columbia University, MIT, Toyota Research Institute)
- **GitHub:** [github.com/real-stanford/diffusion_policy](https://github.com/real-stanford/diffusion_policy)

---

## 2) Detailed summary

### Core idea: action generation as denoising diffusion

Prior robot imitation learning methods frame policy learning as regression (predict a single action vector given observations) or classification (discretize the action space). Both approaches struggle when the demonstrated data contains **multi-modal action distributions** — multiple valid ways to accomplish the same task — because regression collapses to the mean and classification requires careful discretization.

Diffusion Policy reframes the problem: instead of directly predicting an action, the policy learns to **iteratively denoise an action sequence from Gaussian noise**, conditioned on the current visual observation. This is the same denoising diffusion probabilistic model (DDPM) framework used in image generation, now applied to robot action sequences.

At inference time, the policy starts from a random action sample $\mathbf{a}_T \sim \mathcal{N}(0, I)$ and iteratively applies a learned denoising function for $T$ steps to arrive at a clean action chunk $\mathbf{a}_0$:

$$\mathbf{a}_{t-1} = \frac{1}{\sqrt{\alpha_t}}\left(\mathbf{a}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}} \epsilon_\theta(\mathbf{a}_t, t, \mathbf{o})\right) + \sigma_t \mathbf{z}$$

where $\epsilon_\theta$ is the learned noise prediction network conditioned on observation $\mathbf{o}$, and $\mathbf{z} \sim \mathcal{N}(0, I)$.

### Action chunking and receding horizon control

Rather than predicting a single-step action, Diffusion Policy predicts an **action chunk**: a sequence of $H_p$ future actions at once. Executing an entire chunk improves temporal consistency — the robot commits to a coherent motion trajectory rather than re-deciding at every timestep. However, re-planning is still necessary to react to the environment.

The solution is **receding horizon control**: at each step, the policy generates a new chunk of $H_p$ actions but only executes the first $H_a < H_p$ of them before replanning. This balances temporal coherence with real-time reactivity.

### Architecture variants

The paper introduces two backbone variants for the noise prediction network $\epsilon_\theta$:

| Variant | Observation encoder | Denoiser | Inference steps |
|---------|--------------------|---------|--------------------|
| **DDPM + CNN** | CNN (ResNet-style) | 1D temporal U-Net | ~100 steps |
| **DDPM + Transformer** | ViT / Transformer | Transformer with cross-attention | ~100 steps |
| **DDIM + CNN/Transformer** | Same as above | Same + DDIM scheduler | ~10 steps (10× faster) |

Visual observations (RGB images or point clouds) are injected into the denoiser via **FiLM conditioning** (CNN variant) or **cross-attention** (Transformer variant). DDIM (denoising diffusion implicit models) accelerates inference to ~10 steps with minimal quality loss, making real-time control practical.

### Results

Evaluated on 12 tasks across simulation and real-robot settings. Baselines include Behavior Cloning (BC), Implicit Behavioral Cloning (IBC), BC-RNN, and BET (Behavior Transformer).

**Simulation benchmarks (average success rate):**

| Method | Avg. success rate |
|--------|------------------|
| BC | ~48% |
| IBC | ~53% |
| BC-RNN | ~61% |
| BET | ~65% |
| **Diffusion Policy (CNN)** | **~76%** |
| **Diffusion Policy (Transformer)** | **~79%** |

**Real-robot tasks:** Tested on multi-stage kitchen manipulation tasks (cup arrangement, spreading, etc.) with 50–100 teleoperated demos per task. Diffusion Policy consistently outperforms baselines, especially on contact-rich and multi-modal tasks where BC fails by averaging over modes.

### Limitations

- **Inference latency:** DDPM variant requires ~100 denoising steps per action chunk; DDIM reduces this but still adds overhead compared to single-forward-pass policies. Real-time performance requires GPU inference or aggressive DDIM step reduction.
- **Training stability:** Score-matching losses can be sensitive to hyperparameters (noise schedule, number of diffusion steps, action normalization).
- **Action space scope:** Evaluated on end-effector control (6-DOF pose + gripper). Extension to full joint-space or whole-body control is non-trivial.
- **No language conditioning:** The original paper conditions only on visual observations; language-conditioned variants are a natural extension (explored in later work like Diffusion Policy 3D, DP3, etc.).

---

## 3) Why this is an important paper

- **Paradigm shift in policy representation:** Diffusion Policy was the first systematic application of diffusion generative models to robot visuomotor policies. It opened a new paradigm beyond regression and classification, directly enabling subsequent architectures like ACT, $\pi_0$, RoboFlamingo, and Octo.
- **Action chunking as a general principle:** The insight that predicting *sequences* of actions rather than single actions dramatically improves temporal consistency was quickly adopted by the broader community. ACT (Action Chunked Transformers) and $\pi_0$ both build on this principle explicitly.
- **Multi-modal distribution handling:** Many practical manipulation tasks have genuinely multi-modal solution spaces (pick from left or right, approach from multiple angles). Diffusion handles this natively; regressive policies collapse to the mean and fail. This is a fundamental capability gap, not a benchmark difference.
- **Small-data practicality:** Strong performance with 50–100 demonstrations per task makes the method realistic for real-robot deployment where large-scale data collection is expensive — a key practical advantage over methods that require thousands of trajectories.

---

## 4) What Config can apply

- **Bimanual action representation:** Diffusion Policy's action-chunk + receding horizon framework is directly applicable to bimanual coordination. Instead of predicting one arm's trajectory, the policy predicts a joint chunk for both left and right arms simultaneously, capturing inter-arm correlations that independent per-arm policies miss.
- **Multi-modal grasping and placement:** Bimanual manipulation inherently has many valid solution paths (which hand leads, how to approach, which side to place from). Diffusion handles these multi-modal distributions naturally, whereas BC-style policies collapse to blended solutions that may be kinematically infeasible.
- **Data efficiency for human-demonstrated pipelines:** Diffusion Policy performs well with 50–100 teleoperated demonstrations per task, which aligns directly with Config's human demonstration data collection pipeline. High-quality policies can be bootstrapped without large-scale data.
- **Teleop data compatibility:** The original paper trains on teleoperated demonstrations without any domain randomization or sim-to-real transfer. Config's teleoperated data is directly compatible with this training regime — no special preprocessing beyond normalization.
- **DDIM for real-time control:** The DDIM variant reduces denoising to ~10 steps, making real-time inference feasible on onboard compute. Config should evaluate the DDPM vs DDIM trade-off early when targeting deployment cycle times.
