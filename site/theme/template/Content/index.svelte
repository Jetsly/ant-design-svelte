<script>
  import { getContext } from "svelte";
  import MainContent from "./MainContent.svelte";
  import { mdDocList, mdDemoList } from "./page.ts";
  export let page;
  export let component;

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
      demos = [];
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
