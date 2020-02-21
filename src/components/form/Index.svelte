<script lang='ts'>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, Unique, setContext, getContext, get, writable, ValueType, event_type as et, events as e, merge, schemaEvents } from '../../modules/index'
  // import Error from '../UI/Error.svelte'
  declare let $ws_connected
  const dp = createEventDispatcher();
  import { css_count } from '../../modules/global_stores/css'
  import { Debug, showDebug } from '../UI/debug'
  import { notifier } from '../thirdparty/svelte-notifications/src/index'
  import { translation } from '../../modules/global_stores/translation'
  
  import Html from '../UI/Html.svelte'
  import RealForm from './RealForm.svelte'
  import SubmitButton from './_SubmitButton.svelte'
  import CancelButton from './_CancelButton.svelte'
  import * as R from 'ramda'
  import * as RA from 'ramda-adjunct'
  import * as RD from 'rambda'
  import * as RX from 'rambdax'

  export let id = 'insert'
  export let t = []
  export let b = []

  export let key = "0"
  export let schema_key
  export let form = []
  export let fetchConfig = {type: ValueType.Array, project: null}
  export let buttonlabels = {save: "Save", cancel : "Cancel"}
  export let selector = []
  export let headerSchema = []
  export let showdbg = false

  let doms = {}

  let project = getContext('project')
  declare let $project
  let project_ctx = writable([])
  if(project) {
    $project_ctx = $project
  }
  declare let $project_ctx

  fetchConfig = {...fetchConfig, type: ValueType.Array, project: $project_ctx?.[$project_ctx.length - 1]?._key ?? null }

  let events = schemaEvents(Unique.id, schema_key);
  let unsub_evt
  if(events[0]){
    if(key) {
      events[0][0] = et.subscribe
    } else {
      events[0][0] = et.get
    }
    unsub_evt = [et.unsubscribe, ...events[0].slice(1)]
  } else {
    unsub_evt = []
  }
  let data_evt = events[0]
  let mutate_evt = events[1]
  let isUpdate = false
  
  let mounted = false
  let binded = false
  let er = ''
  let isSaving = false
  let form_disabled = true
  
  let options = {disabled: false, notify: true}
  let initial_form = []
  let headers = []
  let schemaGetEvt = []
  if(!data_evt) {
    schemaGetEvt = [et.get, e.my, e.form_schema_get, key ]
  } else {
    schemaGetEvt = []
  }
  function clearError() {
    er = ''
  }
  function onClose() {
    if (key && unsub_evt.length) {
      S.trigger([[unsub_evt, {}]])
    }
  }
  function bindMutate(){
    S.bind$(mutate_evt, onMutateGet, 1)
  }
  function bindAll(){
    bindSchemaDataGet()
    bindMutate()
  }
  function bindSchemaDataGet(){
    if(schemaGetEvt) {
      S.bind$(schemaGetEvt, onSchemaDataGet, 1)
    }
  }
  function fetch() {
    if(headerSchema.length) {
      onMutateGet(headerSchema as [any])
      return
    }
    if(schemaGetEvt && schemaGetEvt.length) {
      const filter = [`="${key}"`]
      //const project_data_store = get(project_data)
      // , level: project_data_store[project_data_store.length - 1]?._key ?? ""   fix lavel 
      // Now auto unsubscribing no need to pass  , ...(isUpdate ?  {unsub: data_evt} : {})
      const args = ["s", filter, { ...fetchConfig, schema: schema_key}] // Todo Fix on c++ side too.
      const e1 = [schemaGetEvt, args]
      S.trigger([e1])
    } else {
      if(mutate_evt) {
        const filter = [`="${key}"`]
        // is schema_key passing neccessary?
        const args = ["s", filter, { ...fetchConfig, schema: schema_key }] // level: project_data_store[project_data_store.length - 1]?._key ?? "" 
        const e1 = [mutate_evt, args]
        S.trigger([e1])
      }
    }
  }
  function onSave() {
    isSaving = true
    const filter = isUpdate ? [`="${fetchConfig.type == ValueType.Object ? form._key : form[0]}"`] : null
    // Now auto unsubscribing no need to pass  , ...(isUpdate ?  {unsub: data_evt} : {})
    const saveConfig = { ...fetchConfig} // , form: true, schema: schema_key
    if(selector.length) {
      saveConfig['sel'] = selector
    }
    const args = [form, filter, saveConfig]
    if(isUpdate) {
      args.push(unsub_evt)
    }
    S.trigger([[mutate_evt, args]])
  }
  function onReset() {
    if(!isUpdate) {
      form = RD.clone(initial_form)
    }
  }
  function onDestroy_() {
    //if (key && unsub_evt) S.trigger([[unsub_evt, {}]])
    S.unbind_(events)
    if(schemaGetEvt.length) {
      S.unbind(schemaGetEvt)
    }
  }
  function onSchemaDataGet(d){
    //headers.set(d[0])
    onMutateGet(d)
    //super.fetch()
  }
  function onMutateGet([d]) {
    isSaving = false
    if(Array.isArray(d[0])){
      const schema = d[0][0]
      const options_new = d[0][1] ?? {}
      const newOptions = {...options, ...options_new}
      options = newOptions
      headers = schema
      const form_values = d[1]
      const form_new = onFormDataGetStatic(form_values)
      if(form_new){
        if (form_new[0]) {
         isUpdate = true
        }
      } else {
        console.log('form value is invalid: ', form_values)
      }
      const new_form = merge(form, form_new)
      form = new_form
      initial_form = RD.clone(new_form)
      
      form_disabled = options.ds ?? false // options.disabled
    } else {
      if (d[0]) {
        const save_msg = R.view(R.lensPath(['msg', 'save']), $translation);
        
        if(options.notify){
          notifier.success(save_msg, 3000)
        }
        er = ''
        dp('successSave', { key: key, d })
        onReset()
      } else {
        er = d[1]
      }
    }
  }
  function mergeFormValues(f) {
    /*if(!isUpdate){
      const s = $default_form[schema_key]
      if(s) {
        for (let i = 0; i < f.length; i++) {
          if (s[i]) {
            f[i] = s[i]
          }
        }
      }
    }*/
    return f   
  }
  function onFormDataGetStatic(d) {
    if (d.r) {
      const r = d.r.result
      if(r.length){
        return mergeFormValues(r[0])
      } else {
        return {}
      }
    } else if (d.n) {
      //d.n.result
    } else if (d.m) {
      const r = d.m.result
      if(r.length){
        return r[0]
      } else {
        return {}
      }
      //d.m.result
    } else if (d.d) {
      //
    }
  }
  onMount(() => {mounted = true; css_count.increase('submit_buttons') })
  onDestroy(() => { onDestroy_(); css_count.decrease('submit_buttons') })
  $: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce(); } else {er = 'Reconnecting...'} }
  function funcBindingOnce () {if (!binded) {bindAll(); binded = true; fetch();}  }
  //console.log($$props)
  $: {
    if(headerSchema.length) {
      onMutateGet(headerSchema as [any])
    }
  }
  // $: {console.log(form)} // hell this prints two time.
  let labels = []
  let types: number[] = []
  let required = []
  let disabled = []
  let description = []
  let props = []
  $: {
    labels = headers[0] ?? []
    types = headers[1] ?? []
    required = headers[2] ?? []
    disabled = headers[3] ?? []
    description = headers[4] ?? []
    props = headers[5] ?? []
  }
  let once = true
  $: {
    if(mounted && once){
      let index = -1
      let i = -1
        for (i = 0; i < disabled.length; i++) {
          if (!disabled[i]) {
            index = i
            break
          }
        }
        if(index > -1) {
          setTimeout(function(){if(doms[index]) doms[index].focus() }, 200);
          once = false
        }
    }
  }
  $: saveLabel = buttonlabels?.save ?? ""
  $: cancelLabel = buttonlabels?.cancel ?? ""
</script>

<Html html={t}/>

{#if showdbg}
  <label>debug</label><input type=checkbox bind:checked={$showDebug} />
{/if}

{#if form.length}
  <form class={id} on:submit|preventDefault={onSave}>
    <RealForm
      {key}
      bind:form={form} {form_disabled}
      {labels} {types} {required} {disabled} {description} {props} bind:doms={doms}
    />

    <SubmitButton isSaving={isSaving} label={saveLabel} save={()=>{}} />
    {#if cancelLabel}
      <CancelButton isSaving={isSaving} {key} on:close label={cancelLabel} />
    {/if}
    {#if false}<button type='button' on:click={onReset}>Reset</button>{/if}

  </form>
{/if}

<!-- <Error {er} /> -->
{er}
{#if showdbg}
{JSON.stringify(form)}
options:
{JSON.stringify(options)}
{/if}

<Html html={b}/>