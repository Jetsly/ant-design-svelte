import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import del from 'del';
import fg from 'fast-glob';

const componetsDir = ['**/*.ts', '!**/*.test.ts', '**/*.svelte']

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd())
  const { ANT_THEME, DEV_THEME } = process.env;
  if (command === 'serve') {
    return {
      plugins: [svelte()]
    }
  } else {
    const entries = await fg(componetsDir, { dot: true, cwd: resolve(__dirname, './components'), onlyFiles: true });
    const rollupInput = entries.reduce((pre, url) => ({
      ...pre,
      [url.replace(/.(\w+)$/, '')]: resolve(__dirname, './components', url)
    }), {})
    await del(["dist", "lib", "es"])
    return {
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
      plugins: [svelte()],
      build: {
        minify: false,
        reportCompressedSize: false,
        cssCodeSplit: false,
        rollupOptions: {
          input: rollupInput,
          treeshake: false,
          external: [/\.less$/, /\.css$/],
          output: [
            {
              dir: 'lib',
              format: 'cjs',
              entryFileNames: `[name].js`
            },
            {
              dir: 'es',
              format: 'es',
              entryFileNames: `[name].js`
            }
          ]
        }
      }
    }
  }
})