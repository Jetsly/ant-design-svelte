<script>
  let mdDoc = [];
  const mdlist = require.context(__dirname, false, /md$/);
  mdlist.keys().forEach(key=>{
    mdDoc.push(mdlist(key).default)
  })
</script>

<div id="components-icon-demo-">
  {#each mdDoc as component}
    <svelte:component this={component} />
  {/each}
</div>
