# Research Paper Template

When adding a new paper to `wiki/en/04-research/` or `wiki/ko/04-research/`, follow this structure exactly. Use RT-2 as the canonical reference.

---

## File naming

`{short-slug}.md` — lowercase, hyphenated, no version numbers (e.g., `clip.md`, `rt-2.md`, `openvla.md`)

---

## Template (English)

```markdown
# {Full paper title}

*{Venue, e.g. arXiv / NeurIPS 2017}* ({Short name, e.g. CLIP})

---

## 1) Brief summary (public date, authors)

- **Public date:** YYYY-MM (arXiv v1 posted **YYYY-MM-DD**; {Conference if applicable})
- **Main link:** [{display url}]({url})          ← omit if no project page
- **arXiv:** [{id}](https://arxiv.org/abs/{id})
- **Authors (representative):** {Name, Name, Name (Org)}
- **GitHub:** [{url}]({url})                      ← omit if not available

---

## 2) Detailed summary

### {Core idea heading}

{Explain the core idea. State the problem it solves, then the approach.}

### {Subsection 2}

{Architecture, training recipe, key design choices, etc.}

### Results

{Key benchmark numbers. Use a table if comparing multiple models.}

### Limitations

{What the paper cannot do or explicitly scopes out.}

---

## 3) Why this is an important paper

- {Bullet 1 — historical or methodological significance}
- {Bullet 2 — what it enables downstream}
- {Bullet 3 — community impact}

---

## 4) What Config can apply

- **{Short label}:** {Concrete, actionable implication for Config's robotics/product work.}
- {Repeat for 3–5 items}
```

---

## Template (Korean)

The Korean version mirrors the English structure with translated headings:

| English heading | Korean heading |
|-----------------|---------------|
| `## 1) Brief summary (public date, authors)` | `## 1) 간략한 내용 (공개일, 주요 저자 등)` |
| `- **Public date:**` | `- **공개일:**` |
| `- **Main link:**` | `- **메인 링크:**` |
| `- **Authors (representative):**` | `- **주요 저자(대표):**` |
| `## 2) Detailed summary` | `## 2) 상세 내용` |
| `## 3) Why this is an important paper` | `## 3) 왜 중요한 논문인가` |
| `## 4) What Config can apply` | `## 4) Config 적용 사례` |

Body text within sections should be written in Korean.

---

## After adding a new paper

1. Add a row to **both** `wiki/en/04-research/README.md` and `wiki/ko/04-research/README.md`
2. Add a nav entry to `wiki-site/src/data/wikiNav.ts` under the `Research` section (chronological order)
