export const mdDocList = require.context(process.env.MD_DOC_URL, true, /\.md$/);
export const mdDemoList = require.context(
  process.env.MD_DEMO_URL,
  true,
  /\/[\w|-]+.((en-us|zh-cn)\.)?md$/i,
);
