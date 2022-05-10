import { defineConfig, loadEnv, UserConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'


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
    plugins: [svelte({
      compilerOptions: {
        hydratable: true,
      }
    })]
  };
  if (command === 'serve') {
    return baseConf
  } else {
    return baseConf
  }
})