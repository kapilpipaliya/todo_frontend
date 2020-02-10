<script>
  export let isSaving = false
  export let disabled = false
  export let title = ''
  export let label = 'Save changes'

  $: label = label || 'Save changes'
  let classn;
  $: {
    classn = 'submit success '
    if(isSaving || disabled) classn += 'disabled '
    if(isSaving) classn += 'loading '
  }


</script>


<button type="submit" class={classn} disabled={isSaving || disabled} {title}>
  <slot>{label}</slot>
</button>
