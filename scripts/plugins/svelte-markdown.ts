import { Plugin, ResolvedConfig } from 'vite'
import { compile } from 'svelte/compiler';
import {
  tagArray as markdonwTagArray,
  sourceArray as markdonwSourceArray,
} from 'alleria/lib/markdown-it';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';

function stringRe(value) {
  return value.replace(/({|})/g, a => `{'${a}'}`);
}

const md = MarkdownIt().use(require('markdown-it-meta'))
  .use(markdonwTagArray)
  .use(markdonwSourceArray);;


function renderCode({ meta, tagArray, sourceArray }: {
  meta?: {
    id: string;
    filename: string;
  };
  tagArray?: Array<{ h2: string; html: string }>;
  sourceArray?: Array<{ lang: string; source: string }>;
}, viteConfig: ResolvedConfig) {
  const code =
    sourceArray
      .filter(({ lang }) => lang === 'html')
      .map(({ source }) => source)[0] || '';
  const { js } = compile(`
<script context="module"> 
  export const meta=${JSON.stringify(meta)};
</script>
<script>
  import Demo from "demo";
  ${/<script>\n?([^>]+)<\/script>/.exec(code)[1]}</script>
<Demo meta={meta} >
<div class="code-box-demo" slot="component">${code.replace(
    /<script>[^>]+>/,
    '',
  )}</div>
<div class="code-box-description" slot="znDesc">${stringRe(
    tagArray
      .filter(({ h2 }) => h2 === 'zh-CN')
      .map(({ html }) => html.replace(/<h2>[^>]+>/, ''))
      .join(''),
  )}</div>
<div class="code-box-description" slot="enDesc">${stringRe(
    tagArray
      .filter(({ h2 }) => h2 === 'en-US')
      .map(({ html }) => html.replace(/<h2>[^>]+>/, ''))
      .join(''),
  )}</div>
<div slot="code"><pre class="language-html">${stringRe(
    hljs.highlight(code, { language: 'html' }).value,
  )}</pre></div>
</Demo>`, { dev: !viteConfig.isProduction });
  return js
}

export default function svelteMarkdown(): Plugin {
  let viteConfig: ResolvedConfig;
  return {
    name: 'vite-plugin-svelte-markdown',
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config;
    },
    transform(src, id, options) {
      if (!id.endsWith('md')) return "";
      const renderD = md.render(src);
      return renderCode(md as any, viteConfig)
    }
  }
}