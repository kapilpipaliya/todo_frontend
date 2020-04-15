<script lang="ts">
  // https://github.com/dylanblokhuis/svelte-loading-skeleton
  import { onMount, onDestroy } from 'svelte';
  import { css_count } from '../../css';
  export let width = '100%';
  export let height = '50px';
  export let borderRadius = '4px';
  export let baseColor = 'rgb(238, 238, 238)';
  export let highlightColor = 'rgb(245, 245, 245)';
  export let animationLength = '1.2s';
  css_count.increase('skeleton');
  onDestroy(() => {
    css_count.decrease('skeleton');
  });
</script>

<div
  class="skeleton"
  style="height: {height}; width: {width}; border-radius: {borderRadius}; --baseColor: {baseColor}; --highlightColor: {highlightColor};
  --animationLength: {animationLength}" />
