<script>
  import { createEventDispatcher } from '../../modules/index'
  const dp = createEventDispatcher()

  export let isSaving = false
  export let label = "Cancel"

  $: label = label || 'Cancel'
  
  $: buttonSaveClass = isSaving === true ? 'cancel disabled loading' : 'cancel'
  export let key = 0
</script>

<button
  type="button"
  class={buttonSaveClass}
  disabled={isSaving}
  on:click={() => dp('close', key)}>
  {label}
</button>
