<script>
  import { Router, Link, Route } from "svelte-routing";
  import Button from "components/button/demo/index.svelte";
  import Grid from "components/grid/demo/index.svelte";
  export let url = "";
</script>

<!-- App.svelte -->

<Router {url}>
  <nav>
    <Link to="components/button">button</Link>
    <Link to="components/grid">grid</Link>
  </nav>
  <div>
     <Route path="components/button" component="{Button}" />
     <Route path="components/grid" component="{Grid}" />
  </div>
</Router>
