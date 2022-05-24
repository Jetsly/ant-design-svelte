import { defineConfig, loadEnv, UserConfig, Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path';
import { compile } from 'svelte/compiler';
import MarkdownIt from 'markdown-it';

function svelteMarkdown(): Plugin {
  const md = MarkdownIt().use(require('markdown-it-meta'));
  return {
    name: 'vite-plugin-svelte-markdown',
    enforce: 'pre',
    transform(src, id, options) {
      if (!id.endsWith('md')) return "";
      const renderD = md.render(src);
      const { meta, tagArray, sourceArray } = md as {
        meta?: {
          id: string;
          filename: string;
        };
        tagArray?: Array<{ h2: string; html: string }>;
        sourceArray?: Array<{ lang: string; source: string }>;
      };
      const { js } = compile(`
      <script context="module"> 
        export const meta=${JSON.stringify(meta)};
      </script>
        <div class="code-box-demo"></div>
      `);
      return {
        code: js.code,
        map: js.map
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd())
  const { ANT_THEME, DEV_THEME } = process.env;
  const baseConf: UserConfig = {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            'root-entry-name': ANT_THEME || DEV_THEME || 'variable',
          },
        }
      }
    },
    resolve: {
      alias: {
        docs: resolve(__dirname, './docs'),
        site: resolve(__dirname, './site'),
        demo: resolve(__dirname, './site/theme/template/Content/Demo'),
        components: resolve(__dirname, './components'),
        'ant-design-svelte': resolve(__dirname, './components'),
      }
    },
    plugins: [
      svelte({
        compilerOptions: {
          hydratable: true,
        }
      }),
      svelteMarkdown()
    ]
  };
  if (command === 'serve') {
    return baseConf
  } else {
    return baseConf
  }
})