# Deep Learning for VLA

How neural networks, backprop, and optimization are used in Vision-Language-Action (VLA) systems.

---

## Why deep learning for robots?

Goal: learn a complex mapping

> (images, language, robot state) → (robot actions)

Deep neural networks can approximate highly non-linear relationships, making them suitable for:

- Parsing visual scenes
- Interpreting language instructions
- Producing low-level or mid-level actions

---

## Network roles in VLA

Typical components:

- **Vision encoder**: image → feature vector (e.g., ResNet, ViT)
- **Language encoder**: text instruction → text embedding
- **Fusion + action head**: combine vision + language (+ robot state) → action

Actions can be:

- Joint-space commands
- End-effector deltas
- Higher-level motion primitives

---

## Forward & backprop

**Forward pass**:

```
inputs (image, text, state)
  → encoders (conv/transformer layers)
  → fusion layers
  → action head (MLP)
  → predicted action
```

**Backpropagation**:

- Compute loss between predicted and target action (from demos)
- Use chain rule to propagate gradients back through all layers
- Update weights with an optimizer (Adam, AdamW, …)

---

## Training pipeline (imitation view)

For BC-style VLA training:

1. Collect demos: $(\text{image}_t, \text{text}, \text{state}_t, a_t)$
2. Forward: network predicts $\hat{a}_t$ from inputs
3. Loss: compare $\hat{a}_t$ vs $a_t$ (MSE, smooth L1, etc.)
4. Backprop + optimizer step
5. Repeat for many batches/epochs

After training, the network acts as the **policy** in the VLA stack.

---

## RL + deep learning

When combining with RL:

- The **policy** is still a neural network
- The **loss** is derived from rewards (policy gradient, PPO, etc.)
- Backprop is used to propagate reward-based gradients into the network weights

Often:

1. Train with imitation (BC) first
2. Fine-tune with RL on real/sim environments

---

## See also

- [Robot Learning (RL)](../04-model-training/04-robot-learning-rl.md)
- [AI / ML basics](ai-ml.md)
- [VLA](../02-model-class/03-vla.md)
