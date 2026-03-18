# AI / ML basics

Core concepts for understanding Foundation Models and robot products.

---

## Key concepts (TBD)

- **Supervised / Unsupervised / Reinforcement Learning**
- **Deep Learning** — NN, backprop, optimization
- **Foundation Model** — pretraining, fine-tuning, zero-shot / few-shot
- **Evaluation** — metrics, benchmarks, real-world validation

---

## Config context

- Data quality directly affects model performance
- "Closing the loop" = train → test in the physical world → improve data/model

---

## See also

- `../../04-research/` — related papers
- `../../study/ai-ml/` — personal notes

---

## Food for Thought

- ML evaluation that works for static benchmarks often doesn’t correlate with robot success, which is why “train/test” is insufficient; if you define robotics-first metrics and run closed-loop physical validation, evaluation becomes a product decision engine.
- Data quality affects performance across supervised/unsupervised/RL, but it’s usually treated as backend; if you make data pipelines a first-class product surface with quality gates, model improvements compound reliably.
- Foundation-model capability must be translated into real-time, safe action generation; if you standardize interface contracts between model outputs and the policy/supervisor stack, you can turn AI capabilities into dependable robot behavior.
