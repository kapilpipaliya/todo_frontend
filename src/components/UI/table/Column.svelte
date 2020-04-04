<script lang="ts">
  import clsx from 'clsx'
  let className = ''
  export { className as class }
  export let border = false
  export let width = 100
  export let flex = false
</script>

<div
  class={clsx('tree-column', className)}
  class:border
  style={`width: ${width}px; ${flex ? 'flex: 1 1 0%;' : ''}`}>
  <slot />
</div>
