import { Plugin } from 'vite'

const importRegex = /import {([\w|,|\s]+)} from ["|']ant-design-svelte["|']/;

export default function moduleImport(): Plugin {
  return {
    name: 'vite-plugin-module-import',
    enforce: 'pre',
    transform(code, id, options) {
      const importCode = importRegex.exec(code);
      if (importCode && importCode.length === 2) {
        const [originSrc, imports] = importCode;
        const distCode = imports.split(',').map(compt => {
          const rename = compt.trim().toLocaleLowerCase();
          return `import ${compt.trim()} from 'ant-design-svelte/${rename}';\n  import 'ant-design-svelte/${rename}/style'`
        }).join('\n')
        return {
          code: code.replace(originSrc, distCode)
        }
      }
      return {
        code: code,
      }
    }
  }
}