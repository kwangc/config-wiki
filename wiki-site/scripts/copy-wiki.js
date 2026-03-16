#!/usr/bin/env node
import { cpSync, mkdirSync, readdirSync, statSync, rmSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const wikiSrc = join(root, '..', 'wiki');
const wikiDest = join(root, 'src', 'content', 'wiki');

/** @type {Record<string, string>} id -> YYYY-MM-DD (source file mtime) */
const lastModified = {};

function copyRecursive(src, dest, locale, relPath) {
  if (!existsSync(src)) return;
  if (existsSync(dest)) rmSync(dest, { recursive: true });
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dest, name);
    const nextRel = relPath ? join(relPath, name) : name;
    if (statSync(s).isDirectory()) {
      copyRecursive(s, d, locale, nextRel);
    } else if (name.endsWith('.md') || name.endsWith('.mdx')) {
      mkdirSync(dirname(d), { recursive: true });
      cpSync(s, d);
      const id = `${locale}/${nextRel.replace(/\.(md|mdx)$/, '')}`;
      const mtime = statSync(s).mtime;
      const tz = process.env.WIKI_TZ || 'Asia/Seoul';
      const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(mtime);
      const y = parts.find((p) => p.type === 'year').value;
      const m = parts.find((p) => p.type === 'month').value;
      const day = parts.find((p) => p.type === 'day').value;
      lastModified[id] = `${y}-${m}-${day}`;
    }
  }
}

const locales = ['en', 'ko'];
for (const locale of locales) {
  const src = join(wikiSrc, locale);
  if (existsSync(src)) {
    copyRecursive(src, join(wikiDest, locale), locale, '');
    console.log('Copied wiki', locale, 'to src/content/wiki/' + locale);
  }
}
if (!existsSync(join(wikiSrc, 'en')) && !existsSync(join(wikiSrc, 'ko'))) {
  console.warn('No wiki/en or wiki/ko found at', wikiSrc);
}

const outPath = join(root, 'src', 'data', 'wiki-last-modified.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(lastModified, null, 2), 'utf8');
console.log('Wrote wiki last-modified map to src/data/wiki-last-modified.json');
