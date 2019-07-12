import test from 'ava';
import { sync } from 'fast-glob';
export default function demoTest(
  component,
  options = {
    skip: false,
  },
) {
  const files = sync(`./components/${component}/demo/*.md`);
  files.forEach(file => {
    let testMethod = options.skip === true ? test.skip : test;
    if (
      Array.isArray(options.skip) &&
      options.skip.some(c => file.includes(c))
    ) {
      testMethod = test.skip;
    }
    testMethod(`renders ${file} correctly`, t => {
      const demo = require(`../.${file}`).default;
      t.snapshot(demo.render().html);
    });
  });
}
