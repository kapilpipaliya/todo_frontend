<script lang='ts'>
  import { onMount, onDestroy, createEventDispatcher, getContext, setContext } from 'svelte'
  import { get, writable } from 'svelte/store'
  import { S, ws_connected } from '../../ws_events_dispatcher'
  import { ET, E, schemaEvents } from '../../events'
  import { merge } from '../../array_functions'
  import { ValueType } from '../../enums'

  // import Error from '../UI/Error.svelte'
  declare let $ws_connected
  const dp = createEventDispatcher();
  import { css_count } from '../../css'
  import { Debug, showDebug } from '../UI/debug'
  import { getNotificationsContext } from '../thirdparty/svelte-notifications/src/index'
  const { addNotification } = getNotificationsContext();
  import { translation } from '../../translation'
  import Html from '../UI/Html.svelte'
  import GeneralInput from './RealForm.svelte'
  import SubmitButton from './_SubmitButton.svelte'
  import CancelButton from './_CancelButton.svelte'
  import { isNumber, isString, isPlainObj } from 'ramda-adjunct'
  import { view, lensPath } from 'ramda'
  import { clone } from 'rambda'
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
  export let showdbg = true
  let doms = {}
  let project = getContext('project')
  declare let $project
  let project_ctx = writable([])
  if(project) {
    $project_ctx = $project
  }
  declare let $project_ctx
  fetchConfig = {...fetchConfig, type: ValueType.Array, project: $project_ctx?.[$project_ctx.length - 1]?._key ?? null }
  let events = schemaEvents(schema_key);
  let unsub_evt
  if(!events) console.warn('events array must be defined')
  const uid = S.uid
  let data_evt
  if(events[0]){
    if(key) {
      data_evt = [ET.subscribe, events[0], uid]
      unsub_evt = [ET.unsubscribe, events[0], uid]
    } else {
      data_evt = [ET.get, events[0], uid]
      unsub_evt = []
    }
  }
  let mutate_evt
  if(key){
   mutate_evt = [ET.update, events[1], uid]
  } else {
   mutate_evt = [ET.insert, events[1], uid]
  }
  let mounted = false
  let binded = false
  let er = ''
  let isSaving = false
  let form_disabled = true
  let options = {disabled: false, notify: true}
  let initial_form = []
  let headers = []
  let schemaGetEvt = []
  let layout = []
  if(!data_evt) {
    schemaGetEvt = [ET.get, E.form_schema_get, key ]
  } else {
    schemaGetEvt = []
  }
  function bindAll(){
    if(schemaGetEvt) {
      S.bind$(schemaGetEvt, onDataGet, 1)
    }
    S.bind$(data_evt, onDataGet, 1)
    S.bind$(mutate_evt, onMutateGet, 1)
  }
  function fetch() {
    if(headerSchema.length) {
      onMutateGet(headerSchema as [any])
      return
    }
    const filter = [`="${key}"`]
    if(schemaGetEvt && schemaGetEvt.length) {
      const args = ["s", filter, { ...fetchConfig, schema: schema_key}]
      const e1 = [schemaGetEvt, args]
      S.trigger([e1])
    } else {
      if(data_evt && data_evt.length) {
        const args = [filter,[],[], { ...fetchConfig, form: true }] // level: project_data_store[project_data_store.length - 1]?._key ?? "" 
        const e1 = [data_evt, args]
        S.trigger([e1])
      }
    }
  }
  let emitEvent = true;
  function onApply() {
    emitEvent = false
    onSave()
  }
  function onSave() {
    isSaving = true
    const filter = key ? [`="${fetchConfig.type == ValueType.Object ? form._key : form[0]}"`] : null
    // Now auto unsubscribing no need to pass  , ...(key ?  {unsub: data_evt} : {})
    const saveConfig = { ...fetchConfig} // , form: true, schema: schema_key
    if(selector.length) {
      saveConfig['sel'] = selector
    }
    const args = [form, filter, saveConfig]
    if(key) {
      args.push(unsub_evt)
    }
    S.trigger([[mutate_evt, args]])
  }
  function onReset() {if(!key) {form = clone(initial_form) } }
  function onDestroy_() {
    if (key && unsub_evt.length) S.trigger([[unsub_evt, {}]])
    S.unbind_(events)
    if(schemaGetEvt.length) {
      S.unbind(schemaGetEvt)
    }
  }
  /*function onSchemaDataGet(d){
    // headers.set(d[0])
  }*/
  function onDataGet(d) {
    if(!d[0]) {
      er = d[1]
    } else if(Array.isArray(d[0])){
      const schema = d[0][0]
      const options_new = d[0][1] ?? {}
      const newOptions = {...options, ...options_new}
      options = newOptions
      headers = schema
      if(newOptions.buttonlabels) buttonlabels = newOptions.buttonlabels
      if(newOptions.l) layout = newOptions.l
      console.warn("layout", layout)
      const form_values = d[1]
      const form_new = onFormDataGetStatic(form_values)
      if(!form_new){
        console.warn('form value is invalid: ', form_values)
      }
      const new_form = merge(form, form_new)
      form = new_form
      initial_form = clone(new_form)
      
      form_disabled = options.ds ?? false // options.disabled
    }
  }
  function onMutateGet(d) {
    isSaving = false
    if (d[0]) {
      const save_msg = view(lensPath(['msg', 'save']), $translation);
      
      if(options.notify){
        addNotification({
            text: save_msg,
            position: 'bottom-center',
          })
      }
      er = ''
      if(emitEvent){
        dp('successSave', { key: key, d })
      }
      onReset()
    } else {
      er = d[1]
    }
  }
  function mergeFormValues(f) {
    /*if(!key){
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
  css_count.increase('submit_buttons')
  onMount(() => {mounted = true;  })
  onDestroy(() => { onDestroy_(); css_count.decrease('submit_buttons') })
  $: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce(); } else {er = 'Reconnecting...'} }
  function funcBindingOnce () {if (!binded) {bindAll(); binded = true; fetch();}  }
  $: {
    if(headerSchema.length) {
      onMutateGet(headerSchema as [any])
    }
  }
  // $: {console.warn("form", form)} // hell this prints two time.
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
  $: applyLabel = buttonlabels?.apply ?? ""
  $: {
  if(!key) {
    if(Array.isArray(form)) {
      for(let i = 0; i < form.length ; i++){
        if(Array.isArray(form[i]) && form[i].length > 0){
          let e = form[i]
          if(Array.isArray(e) && e.length > 0){
            for(let j = 0; j < e.length ; j++){
              let f = e[j]

              if(typeof f[0] == 'string'){
                const func = f[0]
                if(func == 'fnSetContext'){
                  if(f.length > 1){
                    const key = f[1]
                    form[i] = get(getContext(key))
                    continue
                  }
                } else if(func == 'fnSetContextKey'){
                  if(f.length > 1){
                    const key = f[1]
                    let objKey
                    if(f.length > 2){
                      objKey = f[2]
                    } else {
                      objKey = "_key"
                    }


                    form[i] = get(getContext(key))[objKey]
                    continue
                  }
                } else if(func == 'fnSetContextKeyInArray'){
                  if(f.length > 1){
                    const key = f[1]
                    let objKey
                    if(f.length > 2){
                      objKey = f[2]
                    } else {
                      objKey = "_key"
                    }


                    form[i] = [get(getContext(key))[objKey]]
                    continue
                  }
                }

              }
            }
          }
        }
      }
    }
  }
}
const isDisabled = (form_disabled_, i) => {
  if(form_disabled_ === true) {
    return true
  } else {
    return disabled[i]
  }
}
</script>
<Html html={t}/>
{#if showdbg}
  <label>debug</label><input type=checkbox bind:checked={$showDebug} />
{/if}
{#if form.length}
  <form class={id} on:submit|preventDefault={onSave}>

  {#if layout.length}
    {#each layout as lo, loi (lo)}
      {#each lo as i, yi (i)}
        {#if isNumber(i)}
          {#if types[i]}
            <GeneralInput
              bind:value={form[i]}
              type ={types[i]}
              label={labels[i]}
              required={required[i]}
              disabled={isDisabled(form_disabled, i)}
              description={description[i]}
              bind:dom={doms[i]}
              props={props[i]}
            />
          {/if}
        {:else if isPlainObj(i)}
          {@html i.l}
        {/if}
      {/each}
      <br>
    {/each}
  {:else}
    {#each form as f, i}
      {#if types[i]}
        <GeneralInput
          bind:value={f}
          type ={types[i]}
          label={labels[i]}
          required={required[i]}
          disabled={isDisabled(form_disabled, i)}
          description={description[i]}
          bind:dom={doms[i]}
          props={props[i]}
        />
      {/if}
    {/each}
  {/if}

  <SubmitButton isSaving={isSaving} label={saveLabel} save={()=>{}} />
  {#if applyLabel}
    <SubmitButton isSaving={isSaving} type={'button'} label={applyLabel} save={onApply}/>
  {/if}
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