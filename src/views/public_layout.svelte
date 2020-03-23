<script lang="ts">
  import { Route } from '../components/svelte-router-spa/index'
  import { getContext, setContext } from 'svelte'
  import { IS_PRODUCTION, ET, E, ValueType } from '../enums'
  export let currentRoute
</script>

{#if !IS_PRODUCTION}PUBLIC LAYOUT{/if}
<div class="app">
  <section class="section">
    <Route {currentRoute} />
  </section>
</div>
{#if !IS_PRODUCTION}TODO ADD FOOTER TEMPLATE HERE{/if}
