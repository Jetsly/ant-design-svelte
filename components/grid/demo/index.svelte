<script>
  let mdDoc = [];
  const mdlist = require.context(__dirname, false, /md$/);
  mdlist.keys().forEach(key=>{
    mdDoc.push(mdlist(key).default)
  })
</script>

<style>
  :global(.gutter-example .ant-row > div) {
    background: transparent;
    border: 0;
  }
  :global(.gutter-box) {
    background: #00a0e9;
    padding: 5px 0;
  }
</style>

<div id="components-grid-demo-">
  {#each mdDoc as component}
    <svelte:component this={component} />
  {/each}
</div>
