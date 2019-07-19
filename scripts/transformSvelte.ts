import { compile, preprocess } from 'svelte/compiler';
import through2 from 'through2';
import { ModuleFormat } from 'svelte/types/compiler/interfaces';
import { preprocess as preprocessor } from 'svelte-ts-preprocess';

export default (format: ModuleFormat) =>
  through2.obj(async function(file, encoding, next) {
    if (file.isBuffer()) {
      const result = compile(
        (await preprocess(file.contents.toString(), preprocessor(), {
          filename: file.relative,
        })).toString(),
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
          }\nObject.defineProperty(exports, "__esModule", { value: true });`,
        );
      } else {
        file.contents = Buffer.from(result.js.code);
      }
    }
    next(null, file);
  });
