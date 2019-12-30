<script>
  import { createEventDispatcher } from '../modules/functions.ts'
  const dp = createEventDispatcher()

  export let isSaving = false
  $: buttonSaveClass = isSaving === true ? 'disabled loading' : 'success'
  export let key = 0
</script>

<style>
  button {
    color: darkred;
  }
</style>

<button
  type="button"
  class={buttonSaveClass}
  disabled={isSaving}
  on:click={() => dp('close', key)}>
  Cancel
</button>
