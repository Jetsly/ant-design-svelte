<script>
  let mdDoc = [];
  const mdlist = require.context(__dirname, false, /md$/);
  mdlist.keys().forEach(key => {
    mdDoc.push(mdlist(key).default);
  });
</script>

<style>
  :global([id^="components-button-demo-"]) {
    display: flex;
    flex-wrap: wrap;
  }
  :global([id^="components-button-demo-"] .ant-btn) {
    margin-right: 8px;
    margin-bottom: 12px;
  }
  :global([id^="components-button-demo-"] .ant-btn-group > .ant-btn) {
    margin-right: 0;
  }
</style>

<div id="components-button-demo-">
  {#each mdDoc as component}
    <svelte:component this={component} />
  {/each}
</div>
