<script lang="ts">
  export let menu = [];
  let className;
  export { className as class };
</script>

<ul class={className}>
  {#each menu as m}
    {#if !m.hidden}
      <li>
        <a href={m.path}>{m.name}</a>
      </li>
    {/if}
    {#if m.children}
      <svelte:self menu={m.children} />
    {/if}
  {/each}
</ul>
