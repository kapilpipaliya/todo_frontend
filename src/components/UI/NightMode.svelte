<script lang="ts">
  import { is_production } from '../../enums'
  declare let $is_production
</script>

{#if !$is_production}NightMode Todo: Make it saving to the database{/if}
