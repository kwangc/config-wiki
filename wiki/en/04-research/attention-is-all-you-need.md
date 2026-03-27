# Attention Is All You Need

*arXiv / NeurIPS 2017* (Transformer)

---

## 1) Brief summary (public date, authors)

- **Public date:** 2017-06 (arXiv v1 posted **2017-06-12**; NeurIPS 2017)
- **arXiv:** [1706.03762](https://arxiv.org/abs/1706.03762)
- **Authors:** Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin (Google Brain / Google Research)

---

## 2) Detailed summary

### Core idea: replace recurrence entirely with self-attention

Prior sequence models (RNNs, LSTMs, CNNs with dilated convolutions) processed tokens sequentially, making it hard to parallelize training and difficult to model long-range dependencies. This paper proposes the **Transformer**: a model that dispenses with recurrence and convolution entirely, relying solely on **attention mechanisms** to draw global dependencies between input and output.

### Self-attention (Scaled Dot-Product Attention)

The fundamental operation:

$$\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

- **Q** (Query), **K** (Key), **V** (Value) are linear projections of the input.
- Scaling by $\sqrt{d_k}$ prevents vanishing gradients from large dot products in high dimensions.
- Every position can directly attend to every other position — path length between any two positions is O(1), compared to O(n) for RNNs.

### Multi-Head Attention

Rather than applying one attention function, the paper projects Q/K/V into **h** separate lower-dimensional subspaces, computes attention in each, then concatenates and projects:

$$\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1,\dots,\text{head}_h)W^O$$

This lets the model jointly attend to information from different representation subspaces at different positions.

### Encoder-Decoder architecture

- **Encoder**: stack of N=6 identical layers, each with (1) multi-head self-attention + (2) position-wise feed-forward network, with residual connections and layer normalization around each sub-layer.
- **Decoder**: same stack, but adds a third sub-layer of **cross-attention** (attends to encoder output); self-attention in the decoder is masked to prevent attending to future positions.

### Positional Encoding

Since there is no recurrence or convolution, position information is injected via **sinusoidal positional encodings** added to the input embeddings:

$$PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d_{model}})$$
$$PE_{(pos, 2i+1)} = \cos(pos / 10000^{2i/d_{model}})$$

The sinusoidal form allows the model to generalize to sequence lengths not seen during training, and enables relative-position reasoning via linear combinations.

### Training setup

- **Task:** English→German and English→French machine translation (WMT benchmarks)
- **Optimizer:** Adam with a custom learning rate schedule (warm-up steps then decay $\propto \text{step}^{-0.5}$)
- **Regularization:** dropout on sub-layer outputs, label smoothing (ε=0.1)
- **Hardware:** 8 NVIDIA P100 GPUs; base model trained in ~12 hours

### Results

| Model | EN→DE BLEU | EN→FR BLEU | Training cost |
|---|---|---|---|
| Transformer (base) | 27.3 | 38.1 | 0.5 GPU-days |
| Transformer (big) | **28.4** | **41.0** | 6 GPU-days |
| Best prior ensemble | 26.4 | 41.1 | >> |

The Transformer (big) achieves state-of-the-art on EN→DE while training ~10× faster than prior best models. On EN→FR it matches the best with a fraction of the cost.

### Ablations: what actually matters

The paper ablates each component:

- Fewer attention heads or wrong head dimension → worse
- Removing positional encoding → significant drop
- Replacing dot-product with additive attention → slightly worse at scale
- Reducing model depth → consistent BLEU drop

---

## 3) Why this is an important paper

- The Transformer became the **universal backbone** for essentially all modern NLP, vision, and multimodal models (BERT, GPT, ViT, PaLM, LLaMA, Gemini, etc.).
- Self-attention's O(1) path length between any two tokens enabled **long-range dependency modeling** that RNNs struggled with.
- Pure attention allowed **full parallelism during training**, unlocking efficient use of GPU/TPU arrays and the scaling laws that define today's AI landscape.
- The architecture is modality-agnostic: the same mechanism is now applied to text, images, audio, video, point clouds, and **robot action tokens** (as in RT-2).

---

## 4) What Config can apply

- **Foundation of the VLA stack:** Every VLM/LLM backbone Config uses (PaLI-X, Gemini, etc.) is a Transformer. Understanding the original architecture — especially cross-attention and the encoder-decoder boundary — informs design decisions when fine-tuning or adapting these models for robotic control.
- **Action token space design:** RT-2's insight of treating robot actions as tokens plugs directly into the Transformer's sequence-generation framework. The masking trick (decoder causal mask → valid-action mask) is an extension of the decoder self-attention mask introduced here.
- **Cross-attention for multimodal fusion:** The encoder-decoder cross-attention pattern (language queries attending to visual keys/values) is the conceptual template for how language instructions condition on visual observations in VLA models.
- **Positional encoding considerations for robot state:** When encoding temporal sequences of robot observations or action histories, positional encoding strategy (sinusoidal vs. learned vs. RoPE) directly affects how well the model tracks time steps and action ordering.

