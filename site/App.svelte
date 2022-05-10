<script>
  import { setContext } from "svelte";
  import {Route} from 'tinro'; 
  import Layout from "./theme/template/Layout/index.svelte";
  import Home from "./theme/template/Home/index.svelte";
  setContext("lang", "zh-CN");
</script>

<!-- App.svelte -->
<Layout>
  <Route path="/"><Home /></Route>
</Layout>