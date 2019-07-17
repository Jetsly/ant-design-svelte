<script>
  import { setContext } from "svelte";
  import { Router, Link, Route } from "svelte-routing";
  import Content from "./theme/template/Content/index.svelte";
  import Layout from "./theme/template/Layout/index.svelte";
  import Home from "./theme/template/Home/index.svelte";
  export let url = "";
  setContext("lang", "zh-CN");
</script>

<!-- App.svelte -->
<Layout>
  <Router {url}>
    <div>
      <Route path="/" component={Home} />
      <Route path="components/:component" component={Content} />
      <Route path="docs/:page" component={Content} />
    </div>
  </Router>
</Layout>
