import path from 'path';
import { task, series, src, dest, parallel } from 'gulp';
import webpack from 'webpack';
import rimraf from 'rimraf';
import gulpTs from 'gulp-typescript';
import { writeFileSync } from 'fs';
import through2 from 'through2';
import transformLess from './scripts/transformLess';
import transformSvelte from './scripts/transformSvelte';
import webpackBuild from './webpack.build.config';
import webpackSite from './webpack.site.config';

const cwd = process.cwd();
const libDir = path.join(cwd, './lib');
const esDir = path.join(cwd, './es');
const distDir = path.join(cwd, './dist');

function buildWebpack(config) {
  return new Promise(resolve => {
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      const buildInfo = stats.toString({
        colors: true,
        children: true,
        chunks: false,
        modules: false,
        chunkModules: false,
        hash: false,
        version: false,
      });
      console.log(buildInfo);
      resolve();
    });
  });
}

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

task(
  'compile-svelte',
  parallel([
    () =>
      src(['components/**/*.svelte'])
        .pipe(transformSvelte('esm'))
        .pipe(
          gulpTs.createProject('tsconfig.json', {
            module: 'es6',
            allowJs: true,
          })(),
        )
        .pipe(dest(esDir)),
    () =>
      src(['components/**/*.svelte'])
        .pipe(transformSvelte('esm'))
        .pipe(
          gulpTs.createProject('tsconfig.json', {
            module: 'commonjs',
            allowJs: true,
          })(),
        )
        .pipe(dest(libDir)),
  ]),
);
task('compile-build', () => buildWebpack(webpackBuild));

task(
  'pub-with-ci',
  series(() => {
    rimraf.sync(libDir);
    rimraf.sync(esDir);
    rimraf.sync(distDir);
    return Promise.resolve();
  }, parallel(['compile-res', 'compile-ts', 'compile-svelte', 'compile-build'])),
);

task(function copyHtml(cb) {
  writeFileSync(path.join(cwd, '_site/CNAME'), 'ant-svelte.ddot.ink');
  cb();
});

task('site', series([() => buildWebpack(webpackSite), 'copyHtml']));
