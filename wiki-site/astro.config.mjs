import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const isVercel = !!process.env.VERCEL;
const base = isVercel ? '/' : '/Config';
const site = isVercel
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'config-wiki.vercel.app'}`
  : 'https://kwangc.github.io';

export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  site,
  base,
  output: 'static',
  build: {
    assets: '_assets',
  },
});
