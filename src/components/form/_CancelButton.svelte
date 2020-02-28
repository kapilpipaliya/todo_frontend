<script>
  import { createEventDispatcher } from '../../modules/index'
  const dp = createEventDispatcher()

  export let isSaving = false
  export let label = "Cancel"
  export let key = 0

  $: label = label || 'Cancel'
  
  $: buttonSaveClass = isSaving === true ? 'cancel disabled loading' : 'cancel'
</script>

<button
  type="button"
  class={buttonSaveClass}
  disabled={isSaving}
  on:click={() => dp('close', key)}>
  {label}
</button>
