import MarkdownIt from 'markdown-it';
const meta = require('markdown-it-meta');
const loaderUtils = require('loader-utils');
const hljs = require('highlight.js');
const fs = require('fs');

function loader(source) {
  var opts = Object.assign(
    {
      preset: 'default',
      html: true,
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs
              .highlight(lang, str)
              .value.replace(/({|})/g, a => `{'${a}'}`);
          } catch (__) {}
        }
        return '';
      },
    },
    loaderUtils.getOptions(this),
  );
  var md = MarkdownIt(opts.preset, opts).use(meta);
  const scripts = [
    '\nimport Demo from "site/theme/template/Content/Demo";',
  ];
  md.core.ruler.push('update_template', function replace(state) {
    const Token = state.Token;
    const tokens = [];
    const component = new Token('html_block', '', 0);
    const description = new Token('paragraph_open', 'div', 1);
    const code = new Token('paragraph_open', 'div', 1);
    description.attrs = [
      ['slot', 'description'],
      ['class', 'code-box-description'],
    ];
    code.attrs = [['slot', 'code'], ['class', 'highlight-wrapper']];
    state.tokens.forEach(token => {
      if (token.type === 'fence' && token.tag === 'code') {
        scripts.push(/<script>\n?([^>]+)<\/script>/.exec(token.content)[1]);
        component.content = `<div class="code-box-demo" slot="component">${token.content.replace(
          /<script>[^>]+>/,
          '',
        )}</div>`;
        tokens.unshift(component, description);
        tokens.push(
          new Token('paragraph_close', 'div', -1),
          code,
          token,
          new Token('paragraph_close', 'div', -1),
        );
      } else if (token.type === 'inline') {
        token.content = token.content.replace(/({|})/g, a => `{'${a}'}`);
        if (Array.isArray(token.children)) {
          token.children = token.children.map(item => {
            item.content = item.content.replace(/({|})/g, a => `{'${a}'}`);
            return item;
          });
        }
        tokens.push(token);
      } else {
        tokens.push(token);
      }
    });
    state.tokens = tokens;
  });
  const renderedDocument = md.render(source);
  const metad = (md as any).meta;
  return `
  <script>${scripts.join('\n')}</script>
  <Demo style="order:${metad.order}">
    <div class="code-box-title" slot="title">${metad.title['zh-CN']}</div>
    ${renderedDocument}
  </Demo>
  `;
}

// console.log(
//   loader(fs.readFileSync('./components/grid/demo/gutter.md').toString()),
// );
// yarn ts-node -T  scripts/markdown-it-Loader.ts
module.exports = loader;
