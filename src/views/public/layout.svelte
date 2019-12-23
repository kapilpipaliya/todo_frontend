<script>
  import { Route } from 'svelte-router-spa'
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