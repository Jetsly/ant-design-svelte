export default {
  files: ['tests/**/*.test.ts', 'components/**/*.test.ts'],
  sources: ['components/**/*'],
  tap: true,
  babel: false,
  compileEnhancements: false,
  environmentVariables: {},
  extensions: ['ts', 'svelte'],
  require: ['ts-node/register/transpile-only', './tests/_setup.ts'],
};
