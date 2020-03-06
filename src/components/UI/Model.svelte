<script lang='ts'>
  import { createEventDispatcher } from '../../modules/index'
  const dp = createEventDispatcher()
</script>
<div class="modal-background" on:click={() => dp('close')} />
<div class="modal">
  <slot name="header" />
  <hr >
  <slot />
  <slot name="footer" />
  <hr >
</div>