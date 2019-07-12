const hooks = require('require-extension-hooks');
const MarkdownIt = require('markdown-it');
const { compile } = require('svelte/compiler');
const path = require('path');
const ts = require('typescript');

hooks('svelte').push(function({ filename, content }) {
  const { js } = compile(content, {
    filename,
    generate: 'ssr',
    format: 'esm',
  });
  return ts.transpile(js.code, {
    esModuleInterop: true,
  });
});

hooks('md').push(function({ filename, content }) {
  const md = MarkdownIt('default', {
    html: true,
  });
  md.renderer.rules.fence = function fence(tokens, idx, options, env, slf) {
    var token = tokens[idx];
    return token.content.replace(
      `ant-design-svelte`,
      `${path.join(__dirname, '../components/index')}`,
    );
  };
  md.core.ruler.push('update_template', function replace(state) {
    const tokens = [];
    for (let index = 0; index < state.tokens.length; index++) {
      const token = state.tokens[index];
      if (token.type === 'fence' && token.tag === 'code') {
        tokens.push(token);
      }
    }
    state.tokens = tokens;
  });

  const { js } = compile(md.render(content), {
    filename: filename.replace('.md', '.svelte'),
    generate: 'ssr',
    format: 'esm',
  });
  return ts.transpile(js.code, {
    esModuleInterop: true,
  });
});
