<script lang='ts'>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, FormArray } from '../../modules/functions.ts'
  import { Form, SubmitButton, CancelButton } from '../index.ts'
  export let eventsFn: (id: string | number, schema: string) => number[][]
  export let key = 0
  export let schema_key
  const f = new FormArray(S, key, eventsFn(key, schema_key), createEventDispatcher(), schema_key), er = f.er, isSaving = f.isSaving, form = f.form, headers = f.headers, mounted = f.mounted, binded = f.binded, form_disabled = f.form_disabled
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
	bind:headers={$headers}
	bind:form={$form}
	on:close
/>
<div>{$er}</div>
{JSON.stringify($form)}