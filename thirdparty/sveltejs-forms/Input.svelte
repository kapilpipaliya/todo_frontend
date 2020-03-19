<script>
  import { getContext } from 'svelte'
  import get from 'lodash-es/get'
  import { FORM } from './Form.svelte'

  export let name
  export let type = 'text'
  export let placeholder = ''
  export let multiline = false
  export let icon = ''
  let dataappend = null
  $: {
    dataappend = icon ? `<span class='${icon}'>` : null
  }

  const { touchField, setValue, values, errors, touched } = getContext(FORM)

  function onChange(event) {
    if (type == 'checkbox') {
      setValue(name, event.target.checked)
    } else {
      setValue(name, event.target.value)
    }
  }

  function onBlur() {
    touchField(name)
  }
</script>

<div class="field" class:error={get($touched, name) && get($errors, name)}>
  {#if multiline}
    <textarea
      {name}
      {placeholder}
      value={get($values, name)}
      on:blur={onBlur}
      on:change={onChange} />
  {:else}
    <input
      data-role="input"
      data-append={dataappend}
      {name}
      {type}
      {placeholder}
      value={get($values, name)}
      checked={type == 'checkbox' ? get($values, name) : null}
      on:blur={onBlur}
      on:change={onChange} />
  {/if}
  {#if get($touched, name) && get($errors, name)}
    <div class="message">{get($errors, name)}</div>
  {/if}
</div>
