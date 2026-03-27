# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A personal knowledge workspace for Tony Lee (PM/researcher at Config Inc.) combining:
- **`wiki/`** — Markdown knowledge base (English + Korean) on AI, LLM, VLA, Robotics
- **`wiki-site/`** — Astro static site that publishes the wiki to GitHub Pages / Vercel
- **`automation/`** — Scripts for scraping and summarizing AI news
- **`study/`** — Personal learning notes

## Common Commands

All commands run from `wiki-site/`:

```bash
npm run dev        # Copy wiki content + start dev server at http://localhost:4321
npm run build      # Copy wiki content + build static site to dist/
npm run preview    # Preview the built site
```

Run the news scraper manually:
```bash
cd wiki-site
GEMINI_API_KEY=<key> node scripts/update_smol_ai_news.mjs
```

## Architecture

### Wiki Content Pipeline

`wiki/{en,ko}/**/*.md` → `scripts/copy-wiki.js` → `wiki-site/src/content/wiki/{en,ko}/` → Astro build → `dist/`

The `copy-wiki` step runs automatically before `dev` and `build`. It copies markdown files and injects `lastModified` frontmatter by reading git history. **Never edit files in `src/content/wiki/` directly — they are overwritten on every build.**

### Astro Site (`wiki-site/`)

- **`src/pages/`** — URL routing; pages fetch from the content collections
- **`src/content/wiki/`** — Auto-generated from `wiki/` (gitignored equivalent)
- **`src/data/news.json`** — Scraped/summarized news; updated by `update_smol_ai_news.mjs`
- **`src/components/`** — Reusable Astro/HTML components (e.g. theme toggle)
- Math rendering: `remark-math` + `rehype-katex` (LaTeX in markdown)
- Output: fully static (`output: 'static'`, `trailingSlash: 'always'`)

### Deployment Detection

`astro.config.mjs` auto-detects the platform:
- **Vercel**: `base='/'`, site from `VERCEL_PROJECT_PRODUCTION_URL`
- **GitHub Pages**: `base='/config'` (lowercase, matches repo name `kwangc/config`)

### Automation (GitHub Actions)

- **`deploy-wiki.yml`** — Triggers on changes to `wiki/` or `wiki-site/`; builds and deploys to GitHub Pages
- **`update-smol-ai-news.yml`** — Runs daily at 03:00 UTC; scrapes news.smol.ai, summarizes via Gemini, commits updated `news.json`

### News Scraper (`wiki-site/scripts/update_smol_ai_news.mjs`)

Uses the Gemini API to summarize scraped articles into bilingual (EN/KO) entries in `src/data/news.json`. Key env vars:
- `GEMINI_API_KEY` — Required
- `GEMINI_MODEL` — Default: `gemini-2.5-flash-lite`
- `KEEP_LAST_DAYS`, `LOOKBACK_DAYS`, `MAX_PROCESS_NEW` — Tuning parameters

## Wiki Content Structure

```
wiki/
├── en/
│   ├── 01-company/     # Config Inc. info
│   ├── 02-product/     # Product docs
│   ├── 03-domains/     # Technical domains (ML, VLA, Robotics, Training)
│   ├── 04-research/    # Paper summaries
│   ├── 05-industry/    # Industry trends
│   └── 06-glossary/    # Terminology
└── ko/                 # Parallel Korean structure
```

New wiki pages should follow `templates/wiki-page.md`.
