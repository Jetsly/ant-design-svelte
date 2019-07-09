import path from 'path';
import { task, series, src, dest, parallel } from 'gulp';
import rimraf from 'rimraf';
import gulpTs from 'gulp-typescript';
import transformLess from './scripts/transformLess';
import transformSvelte from './scripts/transformSvelte';

const cwd = process.cwd();
const libDir = path.join(cwd, './lib');
const esDir = path.join(cwd, './es');
rimraf.sync(libDir);
rimraf.sync(esDir);

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
task('pub-with-ci', parallel(['compile-res', 'compile-ts', 'compile-svelte']));
