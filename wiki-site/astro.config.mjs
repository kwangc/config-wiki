import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const isVercel = !!process.env.VERCEL;
// GitHub Pages URL is case-sensitive: use lowercase to match repo name (e.g. config)
const base = isVercel ? '/' : '/config';
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
  trailingSlash: 'always',
  build: {
    assets: '_assets',
  },
});
