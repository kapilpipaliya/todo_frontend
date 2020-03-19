<script lang="ts">
  export let name
  export let required
  export let disabled
  export let value
  export let props = {}
  export let dom = null
</script>

<input
  {name}
  bind:this={dom}
  type="hidden"
  bind:value
  {required}
  autocomplete={false}
  {disabled}
  {...props} />
