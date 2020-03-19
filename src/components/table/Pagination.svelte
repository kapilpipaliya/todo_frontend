<script lang="ts">
  export let items
  export let limit
  export let current_page
  export let total_pages
  export let onLimitChange
  export let refresh
  export let pages
</script>

<span>{items.length}{items.length <= 1 ? ' item' : ' items'}</span>
Page Size:
<input
  class="w60"
  type="number"
  bind:value={limit}
  on:change={onLimitChange}
  min="0"
  title="press Enter/Tab" />
{#if false}
  <button class="" on:click={refresh}>Refresh</button>
{/if}
Page:
<select bind:value={current_page} on:change={refresh}>
  {#each pages as p}
    <option value={p}>{p}</option>
  {/each}
</select>
&nbsp;/&nbsp;{total_pages}
