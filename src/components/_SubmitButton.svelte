<script>
  export let isSaving = false
  export let disabled = false
  export let title = ''

  let classn;
  $: {
    classn = 'success '
    if(isSaving || disabled) classn += 'disabled '
    if(isSaving) classn += 'loading '
  }


</script>

<style>
  .success {
    color: green;
  }
  .loading {
    color: grey;
  }
</style>

<button type="submit" class={classn} disabled={isSaving || disabled} {title}>
  <slot>Save changes</slot>
</button>
