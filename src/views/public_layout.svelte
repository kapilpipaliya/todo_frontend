<script lang="ts">
  import { Route } from '../../thirdparty/svelte-router-spa/index';
  import { getContext, setContext } from 'svelte';
  import { is_production, ET, E, ValueType } from '../enums';
  declare let $is_production;
  export let currentRoute;
</script>

{#if !$is_production}PUBLIC LAYOUT{/if}
<div class="app">
  <section class="section">
    <Route {currentRoute} />
  </section>
</div>
{#if !$is_production}TODO ADD FOOTER TEMPLATE HERE{/if}
