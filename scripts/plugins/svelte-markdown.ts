import { relative, join } from 'path';
import { Plugin, ResolvedConfig } from 'vite'
import { compile } from 'svelte/compiler';
import {
  tagArray as markdonwTagArray,
  sourceArray as markdonwSourceArray,
} from 'alleria/lib/markdown-it';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import { transformImport } from './module-import';

type IMDReturn = {
  meta?: {
    id: string;
    filename: string;
    source: string;
  };
  tagArray?: Array<{ h2: string; html: string }>;
  sourceArray?: Array<{ lang: string; source: string }>;
}

function stringRe(value: string | string[]) {
  const val = Array.isArray(value) ? value.join('') : value;
  // 转译 {} ,防止编译
  return val.replace(/({|})/g, a => `{'${a}'}`);
}
function removeH2(str: string) {
  return str.replace(/<h2>[^>]+>/, '')
}

const md = MarkdownIt({
  html: true,
}).use(require('markdown-it-meta'))
  .use(markdonwTagArray)
  .use(markdonwSourceArray);;


function renderCode({ meta, tagArray, sourceArray }: IMDReturn): string {
  const code = sourceArray.filter(({ lang }) => lang === 'html').map(({ source }) => source)[0] || '';
  const style = sourceArray.filter(({ lang }) => lang === 'css').map(({ source }) => source)[0] || '';
  const scriptPart = /<script>\n?([^>]+)<\/script>/.exec(code)[1];
  const htmlPart = code.replace(/<script>[^>]+>/, '');
  const znDesc = stringRe(
    tagArray.filter(({ h2 }) => h2 === 'zh-CN')
      .map(({ html }) => removeH2(html)),
  );
  const enDesc = stringRe(
    tagArray.filter(({ h2 }) => h2 === 'en-US')
      .map(({ html }) => removeH2(html)),
  )
  meta.source = encodeURIComponent(code);
  const hicode = stringRe(hljs.highlight(code, { language: 'html' }).value);
  return `
  <script context="module"> 
    export const meta=${JSON.stringify(meta)};
  </script>
  <script>
    import Demo from "demo";
    ${transformImport(scriptPart)}
  </script>
  <style>${style}</style>
  <Demo meta={meta} >
  <div class="code-box-demo" slot="component">${htmlPart}</div>
  <div class="code-box-description" slot="znDesc">${znDesc}</div>
  <div class="code-box-description" slot="enDesc">${enDesc}</div>
  <div slot="code"><pre class="language-html">${hicode}</pre></div>
  </Demo>
  `;
}

export default function svelteMarkdown(): Plugin {
  let viteConfig: ResolvedConfig;

  function compileScript(code: string) {
    const { js } = compile(code, { dev: !viteConfig.isProduction })
    return js
  }
  return {
    name: 'vite-plugin-svelte-markdown',
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config;
    },
    transform(src, id, options) {
      if (!id.endsWith('md')) return "";
      const renderD = md.render(src);
      const { meta, tagArray, sourceArray } = md as IMDReturn;
      meta.filename = relative(join(__dirname, '../../'), id);
      meta.id = meta.filename.replace(/\//g, '-').replace(/.md/, '');
      if (!/demo/.test(meta.id)) {
        const splitH2Tag = ['API', 'FAQ'];
        return compileScript(`
        <script context="module"> 
        export const meta=${JSON.stringify(meta)};
        export const api=\`${tagArray
            .filter(({ h2 }) => splitH2Tag.indexOf(h2) > -1)
            .map(({ html }) => html)
            .join('')}\`;
        </script>
        ${stringRe(
              /docs/.test(meta.id)
                ? renderD.replace(/<pre/g, '<pre class="language-"')
                : tagArray
                  .filter(({ h2 }) => splitH2Tag.indexOf(h2) === -1)
                  .map(({ html }) => html),
            )}
            `)
      }
      return compileScript(renderCode({ meta, tagArray, sourceArray }))
    }
  }
}