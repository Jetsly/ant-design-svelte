<script>
  import { getContext } from "svelte";
  import MainContent from "./MainContent.svelte";
  export let page;
  export let component;

  const mdDocList = require.context(process.env.MD_DOC_URL, true, /\.md$/);
  const mdDemoList = require.context(
    process.env.MD_DEMO_URL,
    true,
    /\/[\w|-]+.((en-us|zh-cn)\.)?md$/i
  );
  const lang = getContext("lang");

  // console.log($$props);
  // console.log(page);
  let demos = [];
  let doc;
  let isDoc = false;
  $: {
    if (page) {
      doc = mdDocList(
        mdDocList
          .keys()
          .filter(key => RegExp(`${page}.${lang}`, "i").test(key))[0]
      );
    } else {
      demos = []
      mdDemoList
        .keys()
        .filter(key =>
          RegExp(
            `${component}(\\/demo)?\\/[\\w|-]+(\\.${lang})?\.md`,
            "i"
          ).test(key)
        )
        .forEach(key => {
          const mdDemo = mdDemoList(key);
          if (mdDemo.meta.type) {
            doc = mdDemo;
          } else {
            demos.push(mdDemo);
          }
        });
    }
    demos.sort((a, b) => a.meta.order - b.meta.order);
  }
</script>

<svelte:head>
  <title>Ant Design Svelte - {page || component}</title>
</svelte:head>

<MainContent {doc} {demos} {isDoc} />
