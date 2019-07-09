import { readFileSync } from 'fs';
import path from 'path';
import less from 'less';
import postcss from 'postcss';
import through2 from 'through2';
const NpmImportPlugin = require('less-plugin-npm-import');

function transformLess(
  lessFile,
  config = {
    cwd: process.cwd(),
  },
) {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);

  let data = readFileSync(resolvedLessFile, 'utf-8');
  data = data.replace(/^\uFEFF/, '');

  // Do less compile
  const lessOpts = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    plugins: [new NpmImportPlugin({ prefix: '~' })],
    javascriptEnabled: true,
  };
  return less
    .render(data, lessOpts)
    .then(result => {
      const source = result.css;
      return postcss(require('../postcss.config').plugins).process(source, {
        from: lessOpts.paths[0],
      });
    })
    .then(r => {
      return r.css;
    });
}
export default through2.obj(function(file, encoding, next) {
  this.push(file.clone());
  if (
    file.path.match(/\/style\/index\.less$/) ||
    file.path.match(/\/style\/v2-compatible-reset\.less$/)
  ) {
    transformLess(file.path)
      .then(css => {
        file.contents = Buffer.from(css);
        file.path = file.path.replace(/\.less$/, '.css');
        this.push(file);
        next();
      })
      .catch(e => {
        console.error(e);
      });
  } else {
    next();
  }
});
