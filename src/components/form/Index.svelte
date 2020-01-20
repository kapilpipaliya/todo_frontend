<script lang='ts'>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, FormArray, Unique } from '../../modules/functions.ts'
  import { Form, SubmitButton, CancelButton } from '../index.ts'
  export let eventsFn: (id: string | number, schema: string) => number[][]
  export let key = 0
  export let schema_key
  export let form = []
  const f = new FormArray(S, key, eventsFn(Unique.id, schema_key), createEventDispatcher(), schema_key, form), 
    er = f.er,
    isSaving = f.isSaving, 
    form_ = f.form, 
    headers = f.headers, 
    mounted = f.mounted, 
    binded = f.binded, 
    form_disabled = f.form_disabled, 
    options = f.options
  onMount(() => {$mounted = true })
  onDestroy(() => {f.onDestroy() })
  $: if ($mounted) {if ($ws_connected) {$er = ''; funcBindingOnce(); } else {$er = 'Reconnecting...'} }
  function funcBindingOnce () {if (!$binded) {f.bindAll(); $binded = true; f.fetch();}  }
  //console.log($$props)
</script>

<Form
	save={f.onSave}
    {key}
    isSaving={$isSaving}
    form_disabled={$form_disabled}
    options={$options}
	bind:headers={$headers}
	bind:form={$form_}
	on:close={f.onClose} on:close
/>
<div>{$er}</div>
{JSON.stringify($form_)}
options:
{JSON.stringify($options)}