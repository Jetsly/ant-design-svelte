export default {
  files: ['tests/**/*.test.ts', 'components/**/*.test.ts'],
  tap: true,
  babel: false,
  compileEnhancements: false,
  environmentVariables: {},
  extensions: ['ts', 'svelte'],
  require: ['ts-node/register/transpile-only', './tests/_setup.ts'],
};
