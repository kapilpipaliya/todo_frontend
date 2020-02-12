<script lang='ts'>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, Unique, setContext, getContext, get, writable, form_type } from '../../modules/index'
  declare let $ws_connected
  import { FormArray } from '../../modules/form'
  import Form from './Form.svelte'
  import {schemaEvents} from '../../modules/schema_events'
  export let key = "0"
  export let schema_key
  export let form = []
  export let fetchConfig = {type: form_type.array, project: null}
  export let buttonlabels = {}
  export let showCancel = true
  export let fetchSchema = true
  export let headerSchema = []

  let project = getContext('project')
  let project_ctx = writable([])
  if(project) {
    $project_ctx = get(project)
  }
  declare let $project_ctx

  fetchConfig = {...fetchConfig, type: form_type.array, project: $project_ctx?.[$project_ctx.length - 1]?._key ?? null }

  export const f = new FormArray(S, key, schemaEvents(Unique.id, schema_key), createEventDispatcher(), schema_key, form, fetchConfig, fetchSchema, headerSchema), 
    er = f.er,
    isSaving = f.isSaving, 
    form_ = f.form, 
    headers = f.headers, 
    mounted = f.mounted, 
    binded = f.binded, 
    form_disabled = f.form_disabled, 
    options = f.options
  declare let $er
  declare let $isSaving
  declare let $form
  declare let $headers
  declare let $mounted
  declare let $binded
  declare let $form_disabled
  declare let $options

  onMount(() => {$mounted = true })
  onDestroy(() => {f.onDestroy() })
  $: if ($mounted) {if ($ws_connected) {$er = ''; funcBindingOnce(); } else {$er = 'Reconnecting...'} }
  function funcBindingOnce () {if (!$binded) {f.bindAll(); $binded = true; f.fetch();}  }
  //console.log($$props)
</script>

<Form
  {key}
  save={f.onSave}
  isSaving={$isSaving}
  form_disabled={$form_disabled}
  options={$options}
	bind:headers={$headers}
	bind:form={$form_}
	on:close={f.onClose} on:close
  {buttonlabels}
  {showCancel}
  onReset={f.onReset}
/>
<div>{$er}</div>
{JSON.stringify($form_)}
options:
{JSON.stringify($options)}