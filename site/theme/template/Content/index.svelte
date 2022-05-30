<script lang="ts">
  import { getContext } from 'svelte';
  import MainContent from './MainContent.svelte';
  import { meta } from 'tinro';
  const route = meta();
  const mdDocList = import.meta.globEager('docs/**/*.md');
  const mdDemoList = import.meta.globEager('components/**/[a-z|-]+.md');
  const lang = getContext('lang');
  let demos = [];
  let doc;
  let isDoc = false;
  let page;
  let component;
  $: {
    page = route.params.page;
    component = route.params.component;
    if (route.params.page) {
      doc =
        mdDocList[
          Object.keys(mdDocList).filter(key => RegExp(`${page}.${lang}`, 'i').test(key))[0]
        ];
    } else {
      demos = [];
      let demoReg = RegExp(`${component}(\\/demo)?\\/[\\w|-]+(\\.${lang})?\.md`, 'i');
      Object.keys(mdDemoList)
        .filter(key => demoReg.test(key))
        .forEach(key => {
          const mdDemo = mdDemoList[key];
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
<MainContent {doc} {demos} />
