import { Plugin } from 'vite'
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
}) {
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
    </script>
    <Demo meta={meta} >
      <div class="code-box-demo" slot="component">${code.replace(
    /<script>[^>]+>/,
    '',
  )}</div>
      <div slot="code"><pre class="language-html">${stringRe(
    hljs.highlight(code, { language: 'html' }).value,
  )}</pre></div></Demo>
    `);
  console.log(js.code)
  return js
}

export default function svelteMarkdown(): Plugin {
  return {
    name: 'vite-plugin-svelte-markdown',
    enforce: 'pre',
    transform(src, id, options) {
      if (!id.endsWith('md')) return "";
      const renderD = md.render(src);
      return renderCode(md as any)
    }
  }
}