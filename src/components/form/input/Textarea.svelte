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
<textarea
  bind:value
  bind:this={dom}
  {required}
  {disabled}
  rows={5}
  cols={20}
  {placeholder}
  {...props} />
