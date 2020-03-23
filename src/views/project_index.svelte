<script lang="ts">
  import { IS_PRODUCTION } from '../enums'
  export let currentRoute
  export let params
</script>

Project Dash Board
{#if !IS_PRODUCTION}{JSON.stringify(currentRoute)} {JSON.stringify(params)}{/if}
