<script lang="ts">
  export let href;
  export let value;
  export let props = {};
</script>

{#if href}
  <a {href} {...props}>{value}</a>
{/if}
