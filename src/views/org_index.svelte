<script lang="ts">
  import { IS_PRODUCTION } from '../enums'
  export let currentRoute
  export let params
</script>

Organization Dash Board
{#if !IS_PRODUCTION}
  make dashboard for admin, that show last 5 work_pacakages. {JSON.stringify(currentRoute)}
  {JSON.stringify(params)}
{/if}
