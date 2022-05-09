import { resolve } from 'path'
import { defineConfig } from 'rollup';
import del from 'del';
import fg from 'fast-glob';
import esbuild from 'rollup-plugin-esbuild'
import svelte from 'rollup-plugin-svelte';


async function getRollupInput() {
  const componetsDir = ['**/*.ts', '**/*.svelte', '!**/*.test.ts'];
  await del(["dist", "lib", "es"])
  const entries = await fg(componetsDir, { dot: true, cwd: resolve(__dirname, './components'), onlyFiles: true });
  return entries.reduce((pre, url) => ({
    ...pre,
    [url.replace(/.(\w+)$/, '')]: resolve(__dirname, './components', url)
  }), {})
}

export default getRollupInput().then(rollupInput => {
  return defineConfig([{
    input: rollupInput,
    treeshake: false,
    external: [/.*/],
    plugins: [esbuild(), svelte()],
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
  }])
});