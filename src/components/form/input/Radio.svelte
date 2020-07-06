<script lang="ts">
  import Label from '../Label.svelte';
  export let name;
  export let required;
  export let disabled;
  export let value;
  export let props = {};
  export let dom = null;
  export let options = [];
  export let error = '';
</script>

<Label {name} />
{#each options as v}
  <input {name} bind:this={dom} type="radio" bind:value {required} autocomplete={false} {disabled} {...props} />
  <label>{v}</label>
{/each}
{#if error}
  <span>{error}</span>
{/if}
