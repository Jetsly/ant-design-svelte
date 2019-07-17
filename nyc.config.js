module.exports = {
  include: ['components/**/*'],
  exclude: ['**/*.test.ts'],
  extension: ['.ts', '.svelte'],
  reporter: ['lcov', 'text'],
  sourceMap: true,
  instrument: true,
};
