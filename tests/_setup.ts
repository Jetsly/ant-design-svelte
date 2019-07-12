import hooks from 'require-extension-hooks';
import MarkdownIt from 'markdown-it';
import path from 'path';
import ts from 'typescript';
import { compile } from 'svelte/compiler';

function transpileSvelte({ filename, content }) {
  const { js } = compile(content, {
    filename,
    generate: 'ssr',
    format: 'esm',
  });
  return ts.transpile(js.code, {
    esModuleInterop: true,
  });
}

hooks('svelte').push(transpileSvelte);

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
  return transpileSvelte({ content: md.render(content), filename });
});
