<script lang="ts">
  import { is_production } from '../enums'
  declare let $is_production
  export let currentRoute
  export let params
</script>

Organization Dash Board
{#if !$is_production}
  make dashboard for admin, that show last 5 work_pacakages. {JSON.stringify(currentRoute)}
  {JSON.stringify(params)}
{/if}
