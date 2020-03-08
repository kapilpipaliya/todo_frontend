<script lang='ts'>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, setContext, getContext, get, writable, ValueType, ET, E, merge, schemaEvents } from '../../modules/index'
  // import Error from '../UI/Error.svelte'
  declare let $ws_connected
  const dp = createEventDispatcher();
  import { css_count } from '../../modules/global_stores/css'
  import { Debug, showDebug } from '../UI/debug'
  import { getNotificationsContext } from '../thirdparty/svelte-notifications/src/index'
  const { addNotification } = getNotificationsContext();
  import { translation } from '../../modules/global_stores/translation'
  import Html from '../UI/Html.svelte'
  import GeneralInput from './RealForm.svelte'
  import SubmitButton from './_SubmitButton.svelte'
  import CancelButton from './_CancelButton.svelte'
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
  let events = schemaEvents(S.uid, schema_key);
  let unsub_evt
  if(events[0]){
    if(key) {
      events[0][0] = ET.subscribe
    } else {
      events[0][0] = ET.get
    }
    unsub_evt = [ET.unsubscribe, ...events[0].slice(1)]
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
    schemaGetEvt = [ET.get, E.my, E.form_schema_get, key ]
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
  function onReset() {if(!isUpdate) {form = clone(initial_form) } }
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
    console.warn('onDataGet', d)
    if(!d[0]) {
      er = d[1]
    } else if(Array.isArray(d[0])){
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
        console.warn('form value is invalid: ', form_values)
      }
      const new_form = merge(form, form_new)
      form = new_form
      initial_form = clone(new_form)
      
      form_disabled = options.ds ?? false // options.disabled
    }
  }
  function onMutateGet(d) {
    console.warn('onMutateGet ', d)
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
      dp('successSave', { key: key, d })
      onReset()
    } else {
      er = d[1]
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