<script lang="ts">
  export let name;
  export let required;
  export let disabled;
  export let value;
  export let props;
  export let dom = null;
  export let error = '';
  $: props.options = props.options ?? [];
</script>

{#each props['options'] as v, i (i)}
  <label>
    <input {name} bind:this={dom} type="checkbox" value={v} bind:group={value} {required} {disabled} />
    {v}
  </label>
{/each}
{#if error}
  <span>{error}</span>
{/if}
