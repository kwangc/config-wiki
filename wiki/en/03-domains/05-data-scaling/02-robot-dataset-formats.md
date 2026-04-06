# Robot Dataset Formats

Design and tradeoffs of structured formats for robot learning datasets — focusing on the LeRobot dataset format evolution from v2 to v3.

---

## The problem: scaling robot data storage

Robot datasets are multimodal time-series: each episode contains high-frequency sensor readings (proprioception, actions) in tabular form plus camera streams (video). Naive storage creates one file per episode, which causes I/O bottlenecks at scale.

---

## LeRobot Dataset v2.x (per-episode format)

**Structure:**
```
episode-0000.parquet   ← one Parquet per episode
episode-0001.parquet
episode-0000.mp4       ← one MP4 per episode (per camera)
episode-0001.mp4
meta/info.json
meta/stats.json
```

**Characteristics:**
- Simple and easy to inspect per episode
- Works fine for small datasets (hundreds of episodes)

**Bottleneck at scale:**

The core problem is **file-open count per training batch**. With v2, each training sample maps to exactly one episode file. So:

- Batch size 64 from different episodes → up to 64 Parquet files + 64 MP4 files opened simultaneously
- Multi-GPU training with N workers × batch 64 → file opens multiply further
- Hits OS-level limits: file descriptor count, concurrent mmap limits
- **Adding more GPUs doesn't help** — the I/O bottleneck is structural, not compute-bound

---

## LeRobot Dataset v3.0 (chunked file format)

Introduced in LeRobot v0.4.0 (October 2025).

**Structure:**
```
data/
  file-0000.parquet    ← many episodes per file
  file-0001.parquet
videos/
  chunk-000/observation.images.top/
    episode-0000000.mp4
    episode-0000001.mp4
    ...
meta/
  info.json            ← schema, FPS, path templates
  stats.json           ← normalization stats (mean/std/min/max)
  tasks.jsonl          ← task descriptions → integer IDs
  episodes/            ← episode offsets stored as chunked Parquet
    chunk-000.parquet
```

**Key design principle:** decouple storage layout from the API. Data is stored in few large files; the user API still exposes intuitive episode-level access.

**How it solves the bottleneck:**

- N episodes share a single Parquet/MP4 file
- A batch of 64 samples from different episodes may only touch 1–2 files
- File-open count drops from `O(batch_size)` → `O(batch_size / episodes_per_chunk)`
- Sequential read patterns improve cache efficiency
- More GPUs → more throughput, bottleneck is now actually compute-bound

**Episode boundary tracking:**
- Episode offsets (start/end byte position, frame index range) stored in `meta/episodes/`
- Reconstruction of per-episode views is done via metadata, not filename parsing

---

## v3.0 additional features

**Hub-native streaming** (`StreamingLeRobotDataset`):
- Stream directly from Hugging Face Hub without downloading
- Enables training on OXE-scale datasets (400GB+) without local storage

**Dataset editing tools** (v0.4.0+):
- Delete episodes, split/merge datasets, add/remove features via `lerobot-edit-dataset` CLI
- Subtask annotation, image-to-video conversion

**Streaming video encoding** (v0.5.0+):
- Encode video frames in real-time during recording (no wait between episodes)
- Hardware encoder auto-detection (GPU-accelerated encoder if available)

---

## Migration: v2.1 → v3.0

```bash
python -m lerobot.datasets.v30.convert_dataset_v21_to_v30 \
  --repo-id=<HF_USER/DATASET_ID>
```

What it does:
- Aggregates `episode-0000.parquet`, `episode-0001.parquet`, ... → `file-0000.parquet`, ...
- Aggregates `episode-0000.mp4`, `episode-0001.mp4`, ... → merged files
- Rewrites `meta/episodes/` with byte/frame offsets

---

## Config context

- The v2 → v3 pattern is directly relevant to Config's data pipeline: as episode count grows, per-episode file storage creates the same I/O wall
- Chunked file formats with metadata-driven offsets are the right architecture for multi-GPU training at scale
- Hub-native streaming (no download required) is worth evaluating for distributed training setups where storage is a constraint

---

## See also

- [Data & Scaling](./01-data-scaling/)
- [Hugging Face LeRobot](../../../05-industry/11-huggingface-lerobot/)
- [Model Training](../04-model-training/01-overview/)
