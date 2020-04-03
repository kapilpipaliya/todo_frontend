<script lang="ts">
  import { onMount } from 'svelte'
  import clsx from 'clsx'

  export let width
  //export let field;
  //export let label;
  export let flex
  export let border

  let className = ''
  export { className as class }
</script>

<div
  class={clsx('tree-column', className)}
  class:border
  style={`width: ${width}px; ${flex ? 'flex: 1 1 0%;' : ''}`}>
  <slot />
</div>
