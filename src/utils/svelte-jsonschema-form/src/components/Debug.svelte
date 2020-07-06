<script context="module">
  import { writable } from 'svelte/store';
  export const showDebug = writable(false);
</script>

<script lang="js">
  import { onMount, onDestroy } from 'svelte';
  import { css_count } from '../../../../css';

  export let data;
  export let title = 'data';
  let expanded;

  css_count.increase('debug');

  onDestroy(() => {
    css_count.decrease('debug');
  });
</script>

<div class="debug">
  {#if data && $showDebug}
    <section>
      <button type="button" on:click={() => (expanded = !expanded)}>
        {title}
        {#if expanded}-{:else}+{/if}
      </button>
      {#if expanded}
        <pre class:expanded>{JSON.stringify(data, null, 2)}</pre>
      {/if}
    </section>
  {/if}
</div>
