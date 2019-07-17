import path from 'path';
import { task, series, src, dest, parallel } from 'gulp';
import del from 'del';
import gulpTs from 'gulp-typescript';
import { outputFileSync } from 'fs-extra';
import through2 from 'through2';
import GitHub from '@octokit/rest';
import spawn from 'cross-spawn';
import { transformComptLess } from 'alleria/lib/gulp';
import transformSvelte from './scripts/transformSvelte';
import buildWebpack, { buildUmdConfig } from './scripts/buildWebpack';
import createConfig from './webpack.config';

import route from './site/route';

const cwd = process.cwd();
const libDir = path.join(cwd, './lib');
const esDir = path.join(cwd, './es');
const distDir = path.join(cwd, './dist');

const replaceSvelteExt = through2.obj(async function(file, encoding, next) {
  if (file.isBuffer()) {
    file.contents = Buffer.from(
      file.contents.toString().replace(/\.svelte(['|"])/g, (ext, char) => char),
    );
  }
  next(null, file);
});

task('compile-res', () =>
  src([
    'components/**/*.@(png|svg)',
    'components/**/*.less',
    '!components/*/demo/*',
  ])
    .pipe(transformComptLess({ plugins: require('./postcss.config').plugins }))
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
    .pipe(replaceSvelteExt)
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
        .pipe(replaceSvelteExt)
        .pipe(dest(esDir)),
    () =>
      src(['components/**/*.svelte'])
        .pipe(transformSvelte('esm'))
        .pipe(
          gulpTs.createProject('tsconfig.json', {
            module: 'commonjs',
            declaration: false,
            allowJs: true,
          })(),
        )
        .pipe(dest(libDir)),
  ]),
);
task('compile-build', () => buildWebpack(buildUmdConfig));

task(function buildSitefile() {
  return buildWebpack(createConfig({}, { ssr: true }));
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
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="description" content="An enterprise-class UI design language and Sevlte implementation with a set of high-quality Sevlte components, one of best Sevlte UI library for enterprises">
          ${head}
        <link href="/app.css" rel="stylesheet"></head>
        <body>
        <div id="app">${html}</div>
        <script type="text/javascript" src="/app.js"></script>
        </body>
      </html>
  `,
    );
  });
  cb();
});

task(
  'site',
  series(() => del(['./_site', './_ssr_site']), 'buildSitefile', 'generate'),
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
