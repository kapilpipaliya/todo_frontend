<script lang="ts">
  import { is_production } from '../enums';
  declare let $is_production;
  export let currentRoute;
  export let params;
</script>

Project Dash Board
{#if !$is_production}
  {JSON.stringify(currentRoute)} {JSON.stringify(params)}
{/if}
