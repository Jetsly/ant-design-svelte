import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd())
  if (command === 'serve') {
    return {
      plugins: [svelte()]
    }
  } else {
    return {
      plugins: [svelte()],
      build: {
        rollupOptions: {
          input: {
            input: resolve(__dirname, './components/index')
          },
          output: [
            {
              dir: 'lib',
              format: 'cjs',
              entryFileNames: `[name].js`
            }, {
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