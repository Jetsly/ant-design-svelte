import path from 'path';
import { task, series, src, dest, parallel } from 'gulp';
import del from 'del';
import gulpTs from 'gulp-typescript';
import { outputFileSync } from 'fs-extra';
import through2 from 'through2';
import GitHub from '@octokit/rest';
import spawn from 'cross-spawn';
import transformLess from './scripts/transformLess';
import transformSvelte from './scripts/transformSvelte';
import buildWebpack, { buildUmdConfig } from './scripts/buildWebpack';
import createConfig from './webpack.config';

import route from './site/route';

const cwd = process.cwd();
const libDir = path.join(cwd, './lib');
const esDir = path.join(cwd, './es');
const distDir = path.join(cwd, './dist');

task('compile-res', () =>
  src([
    'components/**/*.@(png|svg)',
    'components/**/*.less',
    '!components/*/demo/*',
  ])
    .pipe(transformLess)
    .pipe(dest(esDir))
    .pipe(dest(libDir)),
);
task('compile-ts', () =>
  src(['components/**/*.ts', '!components/*/__tests__/*'])
    .pipe(
      gulpTs.createProject('tsconfig.json', {
        module: 'es6',
        declaration: true,
      })(),
    )
    .pipe(
      through2.obj(async function(file, encoding, next) {
        if (file.isBuffer()) {
          file.contents = Buffer.from(
            file.contents.toString().replace(/.svelte/g, ''),
          );
        }
        next(null, file);
      }),
    )
    .pipe(dest(esDir))
    .pipe(
      gulpTs.createProject('tsconfig.json', {
        module: 'commonjs',
        allowJs: true,
      })(),
    )
    .pipe(dest(libDir)),
);

task('compile-ts-helpers', () =>
  src(['scripts/helpers/svelte-*.ts'])
    .pipe(
      gulpTs.createProject('tsconfig.json', {
        module: 'commonjs',
        declaration: false,
      })(),
    )
    .pipe(dest('./helpers')),
);

task(
  'compile-svelte',
  parallel([
    () =>
      src(['components/**/*.svelte'])
        .pipe(transformSvelte('esm'))
        .pipe(dest(esDir)),
    () =>
      src(['components/**/*.svelte'])
        .pipe(transformSvelte('cjs'))
        .pipe(dest(libDir)),
  ]),
);
task('compile-build', () => buildWebpack(buildUmdConfig));

task(function buildSitefile() {
  return buildWebpack(createConfig({}, { ssr: true }));
});

task(function copyHtml(cb) {
  outputFileSync(path.join(cwd, '_site/CNAME'), 'ant-svelte.ddot.ink');
  cb();
});

task(function generate(cb) {
  route.forEach(url => {
    const { html, head } = require('./_ssr_site/app.js').default.render({
      url,
    });
    outputFileSync(
      path.join(cwd, `_site/${url}/index.html`),
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${head}</title>
        <link href="/app.css" rel="stylesheet"></head>
        <body>
        <script type="text/javascript" src="/app.js"></script>
        <div id="app">${html}</div>
        </body>
      </html>
  `,
    );
  });
  cb();
});

task(
  'site',
  series(
    () => del(['./_site', './_ssr_site']),
    'buildSitefile',
    'copyHtml',
    'generate',
  ),
);

task(
  'compile-release',
  series(
    () => del([libDir, esDir, distDir, './helpers']),
    parallel([
      'compile-res',
      'compile-ts',
      'compile-ts-helpers',
      'compile-svelte',
      'compile-build',
    ]),
  ),
);

task(
  'pub-with-ci',
  series([
    'compile-release',
    cb => {
      spawn.sync('npm', ['publish'], {
        stdio: 'inherit',
      });
      cb();
    },
  ]),
);
