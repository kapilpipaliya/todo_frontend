<script lant='ts'>
  import { Route } from "../../components/svelte-router-spa/src/index";
  import { setContext, getContext } from '../../modules/index'
  //import TopHeader from './top_header.svelte'
  export let currentRoute
  export let params
</script>

<div class="app">
  <!-- <TopHeader /> -->
  <section class="section">
    <Route {currentRoute}  {params}/>
  </section>
</div>