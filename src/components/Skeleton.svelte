<script lang='ts'>
  // https://github.com/dylanblokhuis/svelte-loading-skeleton
  import { onMount, onDestroy } from '../modules/index'
  import { css_count } from '../modules/global_stores/css'
  declare let $css_count
  export let width = "100%"
  export let height = "50px"
  export let borderRadius = "4px"
  export let baseColor = "rgb(238, 238, 238)"
  export let highlightColor = "rgb(245, 245, 245)"
  export let animationLength = "1.2s"
  onMount(() => {
      $css_count.skeleton = ($css_count.skeleton || 0) + 1
  })
  onDestroy(() => {
      $css_count.skeleton = $css_count.skeleton - 1
  })
</script>


<div 
  class="skeleton" 
  style="height: {height}; width: {width}; border-radius: {borderRadius}; --baseColor: {baseColor}; --highlightColor: {highlightColor}; --animationLength: {animationLength}" 
/>