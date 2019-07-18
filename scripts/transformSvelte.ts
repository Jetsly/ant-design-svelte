import { compile, preprocess } from 'svelte/compiler';
import through2 from 'through2';
import { ModuleFormat } from 'svelte/types/compiler/interfaces';
import ts from 'typescript';

export default (format: ModuleFormat) =>
  through2.obj(async function(file, encoding, next) {
    if (file.isBuffer()) {
      const result = compile(
        (await preprocess(
          file.contents.toString(),
          [
            {
              script({ content, filename }) {
                const output = ts.transpileModule(content, {
                  fileName: filename,
                  compilerOptions: {
                    esModuleInterop: true,
                    importHelpers: true,
                    target: ts.ScriptTarget.ES5,
                    module: ts.ModuleKind.ESNext,
                  },
                });
                if (/button/.test(filename)) {
                  console.log(content);
                  console.log(output.outputText);
                }
                return {
                  code: output.outputText,
                  map: output.sourceMapText,
                };
              },
            },
          ],
          {
            filename: file.relative,
          },
        )).toString(),
        {
          hydratable: true,
          format,
        },
      );
      file.extname = '.js';
      if (format === 'cjs') {
        file.contents = Buffer.from(
          `${
            result.js.code
          }\nexports.__esModule = true;`,
        );
      } else {
        file.contents = Buffer.from(result.js.code);
      }
    }
    next(null, file);
  });
