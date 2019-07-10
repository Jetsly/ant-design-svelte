<script>
  import { getContext } from "svelte";
  import MainContent from "./MainContent.svelte";
  export let page;
  export let component;

  const mdDocList = require.context(process.env.MD_DOC_URL, true, /\.md$/);
  const mdDemoList = require.context(process.env.MD_DEMO_URL, true, /\.md$/);
  const lang = getContext("lang");

  console.log($$props);
  console.log(page);
  console.log(component);

  let demos = [];
  let doc;
  $: {
    if (page) {
      mdDocList
        .keys()
        .filter(key => RegExp(`${page}.${lang}`, "i").test(key))
        .forEach(key => {
          demos.push(mdDocList(key));
        });
    } else {
      mdDemoList
        .keys()
        .filter(key =>
          RegExp(`${component}(\\/demo)?\\/\\w+(\\.${lang})?\.md`, "i").test(
            key
          )
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
    doc = doc || demos[0]
  }
</script>

<svelte:head>
  <title>Ant Design Svelte - {page || component}</title>
</svelte:head>

<MainContent {doc} {demos} />
