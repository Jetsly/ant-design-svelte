<script>
  import { setContext } from "svelte";
  import {Route} from 'tinro'; 
  import Layout from "./theme/template/Layout/index.svelte";
  import Content from "./theme/template/Content/index.svelte";
  setContext("lang", "zh-CN");
</script>

<!-- App.svelte -->
<Layout>
  <Route path="/" redirect="/components/button"/>
  <Route path="components/:component"  ><Content /></Route>
  <Route path="docs/:page"  ><Content /></Route>
</Layout>