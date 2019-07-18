const ENV = process.env.NODE_ENV;
if (
  ENV !== 'production' &&
  ENV !== 'test' &&
  typeof console !== 'undefined' &&
  console.warn &&
  typeof window !== 'undefined'
) {
  console.warn(
    'You are using a whole package of ant-design-svelte, ' +
      'please use https://ant-svelte.ddot.ink/docs/getting-started/ to reduce app bundle size.',
  );
}
/* @remove-on-es-build-end */
export { default as version } from './version';
export { default as _util } from './_util';
export { default as Button } from './button';
export { default as Menu } from './menu';
export { Col, Row } from './grid';
export { default as Icon } from './icon';
export { default as tooltip } from './tooltip';
