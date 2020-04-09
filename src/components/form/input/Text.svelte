<script lang="ts">
  import Label from '../Label.svelte';
  export let name;
  export let required;
  export let disabled;
  export let value;
  export let props = {};
  export let placeholder = '';
  export let dom = null;
</script>

<Label {name} />
<input
  {name}
  bind:this={dom}
  type="text"
  bind:value
  {required}
  autocomplete={false}
  {disabled}
  {placeholder}
  {...props} />
