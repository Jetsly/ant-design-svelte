import path from 'path';
import MarkdownIt from 'markdown-it';
import utils from 'markdown-it/lib/common/utils';
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
function text(tokens, idx) {
  return utils.escapeHtml(stringRe(tokens[idx].content));
}
function code_inline(tokens, idx, options, env, slf) {
  var token = tokens[idx];
  return `<code ${slf.renderAttrs(token)}>${utils.escapeHtml(
    stringRe(tokens[idx].content),
  )} </code>`;
}
function code_block(tokens, idx, options, env, slf) {
  var token = tokens[idx];
  return `<pre ${slf.renderAttrs(token)}><code>${utils.escapeHtml(
    stringRe(tokens[idx].content),
  )} </code></pre>`;
}
function fence(tokens, idx, options, env, slf) {
  var token = tokens[idx],
    info = token.info ? utils.unescapeAll(token.info).trim() : '',
    langName = '',
    highlighted,
    i,
    tmpAttrs,
    tmpToken;

  if (info) {
    langName = info.split(/\s+/g)[0];
  }

  if (options.highlight) {
    highlighted =
      options.highlight(token.content, langName) ||
      utils.escapeHtml(token.content);
  } else {
    highlighted = utils.escapeHtml(token.content);
  }

  if (highlighted.indexOf('<pre') === 0) {
    return highlighted + '\n';
  }

  // If language exists, inject class gently, without modifying original token.
  // May be, one day we will add .clone() for token and simplify this part, but
  // now we prefer to keep things local.
  if (info) {
    i = token.attrIndex('class');
    tmpAttrs = token.attrs ? token.attrs.slice() : [];

    if (i < 0) {
      tmpAttrs.push(['class', options.langPrefix + langName]);
    } else {
      tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
    }

    // Fake token just to render attributes
    tmpToken = {
      attrs: tmpAttrs,
    };

    return `<pre ${slf.renderAttrs(
      tmpToken,
    )}><code>${highlighted}</code></pre>`;
  }
  return `<pre ${slf.renderAttrs(token)}><code>${highlighted}</code></pre>`;
}
function loader(source) {
  var opts = Object.assign(
    {
      preset: 'default',
      html: true,
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return stringRe(hljs.highlight(lang, str).value);
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
  md.renderer.rules.text = text;
  md.renderer.rules.code_inline = code_inline;
  md.renderer.rules.code_block = code_block;
  md.renderer.rules.fence = fence;
  const renderedDocument = md.render(source);
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
  ${tagArray
    .filter(({ h2 }) => splitH2Tag.indexOf(h2) === -1)
    .map(({ html }) => html)
    .join('')}
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
<div class="code-box-description" slot="znDesc">${tagArray
    .filter(({ h2 }) => h2 === 'zh-CN')
    .map(({ html }) => html.replace(/<h2>[^>]+>/, ''))}</div>
<div class="code-box-description" slot="enDesc">${tagArray
    .filter(({ h2 }) => h2 === 'en-US')
    .map(({ html }) => html.replace(/<h2>[^>]+>/, ''))}</div>
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
