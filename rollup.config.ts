import { dirname, resolve } from 'path'
import { defineConfig } from 'rollup';
import del from 'del';
import fg from 'fast-glob';
import esbuild from 'rollup-plugin-esbuild'
import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy'
import multi from '@rollup/plugin-multi-entry';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';



const { ANT_THEME, DEV_THEME } = process.env;

const postcssUseConf = {
  less: {
    javascriptEnabled: true,
    modifyVars: {
      'root-entry-name': ANT_THEME || DEV_THEME || 'variable',
    },
  },
  sass: false,
  stylus: false
}

async function getRollupInput() {
  const componetsDir = ['**/*.(ts|svelte)', '!**/*.test.ts', '!_util/**'];
  const entries = await fg(componetsDir, { dot: true, cwd: resolve(__dirname, './components'), onlyFiles: true });
  return entries.reduce((pre, url) => ({
    ...pre,
    [url.replace(/.(\w+)$/, '')]: resolve(__dirname, './components', url)
  }), {})
}

async function getRollupLessInput() {
  const componetsDir = ['**/index.less'];
  const entries = await fg(componetsDir, { dot: true, cwd: resolve(__dirname, './components'), onlyFiles: true });
  return entries
}


export default Promise.all([getRollupInput(), getRollupLessInput()]).then(async ([rollupInput, rollupLessInput]) => {
  await del(["dist", "lib", "es"])
  return defineConfig([
    ...rollupLessInput.map(url => defineConfig({
      input: resolve(__dirname, './components', url),
      plugins: [
        copy({
          targets: [
            {
              src: resolve(__dirname, './components', url),
              dest: [
                `es/${dirname(url)}`, `lib/${dirname(url)}`
              ]
            },
          ]
        }),
        postcss({
          extract: `${url.replace(/\.less$/, '.css')}`,
          use: postcssUseConf,
        })
      ],
      output: [
        {
          dir: 'lib',
          entryFileNames: `template_less.js`
        },
        {
          dir: 'es',
          entryFileNames: `template_less.js`
        }
      ],
    })),
    {
      input: rollupInput,
      treeshake: false,
      external: [/.*/],
      plugins: [
        replace({ '.svelte': '', preventAssignment: true }), esbuild(), svelte(), json()
      ],
      output: [
        {
          dir: 'lib',
          format: 'cjs',
          exports: 'auto',
          entryFileNames: `[name].js`
        },
        {
          dir: 'es',
          format: 'es',
          exports: 'named',
          entryFileNames: `[name].js`
        }
      ]
    },
    {
      input: [
        resolve(__dirname, './components', 'index.ts'),
        ...rollupLessInput.map(url => resolve(__dirname, './components', url))
      ],
      plugins: [
        multi({
          entryFileName: 'antd.js'
        }),
        esbuild(), svelte(), nodeResolve(), json(),
        postcss({
          extract: true,
          use: postcssUseConf,
        })
      ],
      output: {
        format: 'umd',
        dir: 'dist',
        name: 'antd',
      }
    }
  ])
});