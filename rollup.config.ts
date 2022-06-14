import { dirname, resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { defineConfig, rollup } from 'rollup';
import del from 'del';
import fg from 'fast-glob';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild'
import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss'
import multi from '@rollup/plugin-multi-entry';
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

function realPath(url: string) {
  return resolve(__dirname, './components', url)
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
  const componetsDir = ['**/*.less'];
  const entries = await fg(componetsDir, { dot: true, cwd: resolve(__dirname, './components'), onlyFiles: true });
  return entries
}

function copyFile(url: string, dir: string) {
  const path = `${resolve(__dirname, dir, url)}`;
  if (!existsSync(dirname(path))) {
    mkdirSync(dirname(path))
  }
  copyFileSync(realPath(url), path)
}

export default Promise.all([getRollupInput(), getRollupLessInput()]).then(async ([rollupInput, rollupLessInput]) => {
  const entryLessFiles = rollupLessInput.filter(url => url.endsWith('index.less'));
  await del(["dist", "lib", "es"])
  await Promise.all(entryLessFiles.map(url => rollup(defineConfig({
    watch: false,
    input: realPath(url),
    plugins: [
      postcss({
        extract: `${url.replace(/\.less$/, '.css')}`,
        use: postcssUseConf,
      })
    ],
  })).then(async bundle => await Promise.all([
    bundle.write({ dir: 'lib' }), bundle.write({ dir: 'es' })
  ]))))
  await del(["lib/**.js", "es/**.js"])
  rollupLessInput.forEach(url => {
    copyFile(url, './es');
    copyFile(url, './lib');
  })
  return defineConfig([
    {
      watch: false,
      input: rollupInput,
      treeshake: false,
      external: [/.*/],
      plugins: [
        replace({ '.svelte': '', preventAssignment: true }), esbuild(), svelte({
          compilerOptions: {
            hydratable: true
          }
        }), json()
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
      watch: false,
      input: [
        resolve(__dirname, './components', 'index.ts'),
        ...entryLessFiles.map(realPath)
      ],
      plugins: [
        multi({
          entryFileName: 'antd.js'
        }),
        esbuild(), svelte({ preprocess: {}, compilerOptions: { hydratable: true } }), nodeResolve(), json(),
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