<script lang="ts">
  import { Route } from '../components/svelte-router-spa/index'
  import { getContext, setContext } from 'svelte'
  export let currentRoute
</script>

PUBLIC LAYOUT
<div class="app">
  <section class="section">
    <Route {currentRoute} />
  </section>
</div>
TODO ADD FOOTER TEMPLATE HERE
