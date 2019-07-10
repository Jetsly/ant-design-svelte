import path from 'path';
import MarkdownIt from 'markdown-it';
import utils from 'markdown-it/lib/common/utils';

const markdonwMeta = require('markdown-it-meta');
const loaderUtils = require('loader-utils');
const hljs = require('highlight.js');
const fs = require('fs');
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
  let otherTokens = [];
  const md = MarkdownIt(opts.preset, opts).use(markdonwMeta);
  const otherMd = MarkdownIt(opts.preset, opts);
  md.renderer.rules.text = otherMd.renderer.rules.text = text;
  md.renderer.rules.code_inline = otherMd.renderer.rules.code_inline = code_inline;
  md.renderer.rules.code_block = otherMd.renderer.rules.code_block = code_block;
  otherMd.core.ruler.push('update_template', function replace(state) {
    state.tokens = otherTokens;
  });
  const scripts = [];
  let api = '';
  let enDes = '';
  let znDes = '';
  if (opts.isDemo) {
    const enDesToken = [];
    const znDesToken = [];
    let isenDes = false;
    let isznDes = false;
    md.core.ruler.push('update_template', function replace(state) {
      const Token = state.Token;
      const tokens = [];
      const component = new Token('html_block', '', 0);
      const code = new Token('paragraph_open', 'div', 1);
      code.attrs = [['slot', 'code'], ['class', 'highlight-wrapper']];
      for (let index = 0; index < state.tokens.length; index++) {
        const token = state.tokens[index];
        if (
          token.type === 'heading_open' &&
          token.tag === 'h2' &&
          state.tokens[index + 1].content == 'en-US'
        ) {
          isznDes = false;
          isenDes = true;
          index = index + 2;
          continue;
        } else if (
          token.type === 'heading_open' &&
          token.tag === 'h2' &&
          state.tokens[index + 1].content == 'zh-CN'
        ) {
          isznDes = true;
          isenDes = false;
          index = index + 2;
          continue;
        }
        if (token.type === 'fence' && token.tag === 'code') {
          isznDes = false;
          isenDes = false;
          scripts.push(/<script>\n?([^>]+)<\/script>/.exec(token.content)[1]);
          component.content = `<div class="code-box-demo" slot="component">${token.content.replace(
            /<script>[^>]+>/,
            '',
          )}</div>`;
          tokens.unshift(component);
          tokens.push(code, token, new Token('paragraph_close', 'div', -1));
        } else if (isenDes) {
          enDesToken.push(token);
        } else if (isznDes) {
          znDesToken.push(token);
        } else {
          tokens.push(token);
        }
      }
      state.tokens = tokens;
      otherTokens = enDesToken;
      enDes = otherMd.render('');
      otherTokens = znDesToken;
      znDes = otherMd.render('');
    });
  } else {
    const apiToken = [];
    md.core.ruler.push('update_template', function replace(state) {
      const tokens = [];
      let isApi = false;
      state.tokens.forEach((token, idx) => {
        if (
          token.type === 'heading_open' &&
          token.tag === 'h2' &&
          state.tokens[idx + 1].content == 'API'
        ) {
          isApi = true;
        }
        if (isApi) {
          apiToken.push(token);
        } else {
          tokens.push(token);
        }
      });
      state.tokens = tokens;
      otherTokens = apiToken;
      api = otherMd.render('');
    });
  }
  const renderedDocument = md.render(source);
  const meta = (md as any).meta;
  if (isUsed) {
    meta.filename = path.relative(
      path.join(__dirname, '../../'),
      this.resourcePath,
    );
    meta.id = meta.filename.replace(/\//g, '-').replace(/.md/, '');
  }
  return `
  <script context="module"> 
     export const meta=${JSON.stringify(meta)};
     export const api=\`${api}\`;
  </script>
  ${
    opts.isDemo
      ? `<script>
      import Demo from "demo";
      ${scripts.join('\n')}</script>
        <Demo meta={meta} >
        <div class="code-box-description" slot="znDesc">${znDes}</div>
        <div class="code-box-description" slot="enDesc">${enDes}</div>
        ${renderedDocument} 
        </Demo>`
      : renderedDocument
  }
  `;
}
// console.log(
//   loader(fs.readFileSync('./components/button/demo/basic.md').toString()),
// );
// DEBUT_LOADER=111 yarn ts-node -T  scripts/helpers/markdown-it-Loader.ts
module.exports = loader;
