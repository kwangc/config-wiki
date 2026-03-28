# Competitive Landscape — Robotics & Embodied AI

A map of where the key players sit, how they differ from Config, and what to watch.

*Last updated: 2026-03-27*

---

## 2D Positioning Map

Two axes matter most for understanding where a company sits:

- **X-axis: Model-first ↔ Hardware-first** — does the company derive value primarily from AI/software, or from its own robot hardware?
- **Y-axis: Generalist ↔ Specialist** — does it aim for a policy that works across many tasks/embodiments, or optimize for one specific domain?

<svg viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;display:block;margin:1.5rem auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
  <!-- Card background -->
  <rect width="600" height="480" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
  <!-- Config quadrant highlight (top-left = model-first + generalist) -->
  <clipPath id="clip-tl"><rect width="600" height="480" rx="14"/></clipPath>
  <rect x="0" y="0" width="298" height="238" fill="#EFF6FF" clip-path="url(#clip-tl)"/>
  <!-- Axis lines -->
  <line x1="55" y1="238" x2="545" y2="238" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="298" y1="44" x2="298" y2="436" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5,4"/>
  <!-- Axis arrowheads -->
  <polygon points="298,44 293,56 303,56" fill="#94a3b8"/>
  <polygon points="298,436 293,424 303,424" fill="#94a3b8"/>
  <polygon points="55,238 67,233 67,243" fill="#94a3b8"/>
  <polygon points="545,238 533,233 533,243" fill="#94a3b8"/>
  <!-- Axis labels -->
  <text x="298" y="33" text-anchor="middle" fill="#64748b" font-size="10.5" font-weight="600" letter-spacing="0.07em">MODEL-FIRST</text>
  <text x="298" y="462" text-anchor="middle" fill="#64748b" font-size="10.5" font-weight="600" letter-spacing="0.07em">HARDWARE-FIRST</text>
  <text x="30" y="238" text-anchor="middle" fill="#64748b" font-size="10.5" font-weight="600" letter-spacing="0.07em" transform="rotate(-90,30,238)">GENERALIST</text>
  <text x="570" y="238" text-anchor="middle" fill="#64748b" font-size="10.5" font-weight="600" letter-spacing="0.07em" transform="rotate(90,570,238)">SPECIALIST</text>
  <!-- Quadrant corner labels -->
  <text x="62" y="64" fill="#93c5fd" font-size="9" font-weight="500">Model-first · Generalist</text>
  <text x="312" y="64" fill="#94a3b8" font-size="9" font-weight="400" opacity="0.8">Model-first · Specialist</text>
  <text x="62" y="424" fill="#94a3b8" font-size="9" font-weight="400" opacity="0.8">Hardware-first · Generalist</text>
  <text x="312" y="424" fill="#94a3b8" font-size="9" font-weight="400" opacity="0.8">Hardware-first · Specialist</text>
  <!-- ── Companies ── -->
  <!-- Generalist (startup) -->
  <circle cx="108" cy="92" r="5" fill="#94a3b8"/>
  <text x="120" y="96" fill="#475569" font-size="10.5">Generalist</text>
  <!-- Physical Intelligence -->
  <circle cx="192" cy="108" r="5" fill="#94a3b8"/>
  <text x="204" y="112" fill="#475569" font-size="10.5">Physical Intelligence</text>
  <!-- NVIDIA GR00T -->
  <circle cx="162" cy="172" r="5" fill="#94a3b8"/>
  <text x="174" y="176" fill="#475569" font-size="10.5">NVIDIA GR00T</text>
  <!-- 1X Technologies -->
  <circle cx="210" cy="268" r="5" fill="#94a3b8"/>
  <text x="222" y="272" fill="#475569" font-size="10.5">1X Technologies</text>
  <!-- Figure -->
  <circle cx="190" cy="315" r="5" fill="#94a3b8"/>
  <text x="202" y="319" fill="#475569" font-size="10.5">Figure</text>
  <!-- Apptronik -->
  <circle cx="238" cy="352" r="5" fill="#94a3b8"/>
  <text x="250" y="356" fill="#475569" font-size="10.5">Apptronik</text>
  <!-- Unitree -->
  <circle cx="152" cy="378" r="5" fill="#94a3b8"/>
  <text x="164" y="382" fill="#475569" font-size="10.5">Unitree</text>
  <!-- Agility Robotics -->
  <circle cx="380" cy="338" r="5" fill="#94a3b8"/>
  <text x="392" y="342" fill="#475569" font-size="10.5">Agility Robotics</text>
  <!-- Boston Dynamics -->
  <circle cx="448" cy="372" r="5" fill="#94a3b8"/>
  <text x="390" y="368" fill="#475569" font-size="10.5">Boston Dynamics</text>
  <!-- Machina Labs -->
  <circle cx="492" cy="400" r="5" fill="#94a3b8"/>
  <text x="434" y="396" fill="#475569" font-size="10.5">Machina Labs</text>
  <!-- ── Config (highlighted) ── -->
  <circle cx="232" cy="140" r="13" fill="#DBEAFE" stroke="#3B82F6" stroke-width="2" opacity="0.85"/>
  <circle cx="232" cy="140" r="6" fill="#2563EB"/>
  <text x="250" y="135" fill="#1D4ED8" font-size="12.5" font-weight="700">Config</text>
</svg>

Config sits in the **model-first + generalist** quadrant, differentiated by the **data-to-action-label interface** (bimanual precision + scenario diversity + closed-loop iteration).

---

## Company profiles

| Company | Focus | Funding | Config overlap | Config differentiation |
|---------|-------|---------|----------------|------------------------|
| [Physical Intelligence (π)](./01-physical-intelligence/) | Robotics foundation models | ~$470M | Closest: generalist model strategy | Config: data precision pipeline + bimanual focus |
| [Generalist](./02-generalist/) | Embodied foundation models, dexterity | Undisclosed (2025 seed) | High: model-first, generalist | Config: product pipeline, not pure research |
| [1X Technologies](./03-1x/) | Humanoid robots for home/real environments | ~$100M+ | Medium: real-world deployment focus | Config: software + data stack, not hardware |
| [Figure](./04-figure/) | Autonomous humanoid robots | ~$675M+ | Medium: general-purpose manipulation | Config: bimanual precision + data infrastructure |
| [Agility Robotics / Digit](./05-agility-robotics/) | Humanoid for logistics (Amazon partnership) | ~$150M+ | Low-medium: deployment in real warehouses | Config: data precision, not fixed-task pipeline |
| [Boston Dynamics](./06-boston-dynamics/) | Advanced robot hardware + mobility | Acquired by Hyundai | Low: hardware-first, specific platforms | Config: embodiment-agnostic, data-driven |
| [Unitree Robotics](./07-unitree/) | Low-cost humanoid and quadruped robots | Undisclosed | Low: hardware commoditization | Config: software/data stack, not price war |
| [NVIDIA (GR00T / Isaac)](./08-nvidia-gr00t/) | Sim + foundation model platform | (Public; ~$3T market cap) | Medium: sim-to-real + foundation model infra | Config: real-world data, not sim-first |
| [Apptronik / Apollo](./09-apptronik/) | General-purpose humanoid, Samsung partnership | ~$350M | Low-medium: general manipulation tasks | Config: precision bimanual data, not general humanoid |
| [Machina Labs](./10-machina-labs/) | Robotic sheet metal forming | ~$32M | Low: industrial materials, single domain | Different market; interesting data-loop pattern |

---

## What to watch

### For Config

- **Physical Intelligence**: closest strategy; watch their data pipeline and action representation choices
- **NVIDIA GR00T**: if sim-to-real matures, it could reduce the advantage of real-world data collection — monitor transfer quality gap
- **Unitree**: hardware commoditization lowers robot cost — could expand the addressable market for Config's software/data stack
- **Agility/Figure**: real-world deployment at scale gives them unique feedback loops — watch their failure mode and data diversity strategies

### Market dynamics

- **2025-2026 trend**: capital flowing from hardware-first to model-first/data-first startups
- **Bimanual manipulation**: still an unsolved hard problem at scale; Config's focus area is defensible
- **Sim-to-real gap**: actively closing; how fast matters for everyone in this quadrant

---

## See also

- Individual company pages linked in the table above
- [About Config](../01-company/about/)
- [Product Strategy](../02-product/05-product-strategy/)
