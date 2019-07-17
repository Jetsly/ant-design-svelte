import path from 'path';
import MarkdownIt from 'markdown-it';
import {
  tagArray as markdonwTagArray,
  sourceArray as markdonwSourceArray,
} from 'alleria/lib/markdown-it';
import hljs from 'highlight.js';
import fs from 'fs';
const markdonwMeta = require('markdown-it-meta');
const loaderUtils = require('loader-utils');
const isUsed = !process.env.DEBUT_LOADER;
function stringRe(value) {
  return value.replace(/({|})/g, a => `{'${a}'}`);
}
function loader(source) {
  var opts = Object.assign(
    {
      preset: 'default',
      html: true,
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }
        return '';
      },
      isDemo: true,
    },
    isUsed ? loaderUtils.getOptions(this) : {},
  );
  const md = MarkdownIt(opts.preset, opts)
    .use(markdonwMeta)
    .use(markdonwTagArray)
    .use(markdonwSourceArray);

  const renderD = md.render(source);
  const { meta, tagArray, sourceArray } = md as {
    meta?: {
      id: string;
      filename: string;
    };
    tagArray?: Array<{ h2: string; html: string }>;
    sourceArray?: Array<{ lang: string; source: string }>;
  };
  if (isUsed) {
    meta.filename = path.relative(
      path.join(__dirname, '../../'),
      this.resourcePath,
    );
    meta.id = meta.filename.replace(/\//g, '-').replace(/.md/, '');
  }
  const code =
    sourceArray
      .filter(({ lang }) => lang === 'html')
      .map(({ source }) => source)[0] || '';
  if (!opts.isDemo) {
    const splitH2Tag = ['API', 'FAQ'];
    return `
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
          .map(({ html }) => html)
          .join(''),
  )}
  `;
  }
  return `
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
    hljs.highlight('html', code).value,
  )}</pre></div>
</Demo>
  `;
}
// console.log(
//   loader(fs.readFileSync('./components/button/demo/basic.md').toString()),
// );
// DEBUT_LOADER=111 yarn ts-node -T  scripts/helpers/markdown-it-Loader.ts
module.exports = loader;
