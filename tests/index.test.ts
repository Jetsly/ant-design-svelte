import test from 'ava';
import fs from 'fs-extra';

test('exports modules correctly', t => {
  const ant = require('../components');
  t.snapshot(Object.keys(ant));
});
test('should have antd.version', t => {
  const antd = require('../components');
  t.is(antd.version, fs.readJsonSync('./package.json').version);
});
