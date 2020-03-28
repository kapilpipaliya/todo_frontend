<script lang="ts">
  /**
  * This is the Main Component for the form. it render form from the schema.
  \todo make model form working  
  \todo make user able to add custom fields to any form
  \todo make form work for multiple level modification by user 
  \todo make update & delete return preojection of inserted/updated members too
  \todo schema can be made to not make projection for inserted/updated/deleted members 
*/
  import { onMount, onDestroy, createEventDispatcher, getContext } from 'svelte'
  import { get, writable } from 'svelte/store'
  import { S, ws_connected } from '../../ws_events_dispatcher'
  declare let $ws_connected
  import { ET, E, schemaEvents } from '../../enums'
  import { IS_PRODUCTION, ValueType } from '../../enums'
  import { css_loading, css_count } from '../../css'
  import { Debug, showDebug } from '../UI/debug'
  import { getNotificationsContext } from '../../../thirdparty/svelte-notifications/src/index'
  import { translation } from '../../translation'
  import { isNumber, isString, isPlainObj } from 'ramda-adjunct'
  import { view, lensPath } from 'ramda'
  import { clone } from 'rambda'
  import Html from '../UI/Html.svelte'
  import GeneralInput from './RealForm.svelte'
  import SubmitButton from './SubmitButton.svelte'
  import CancelButton from './CancelButton.svelte'
  // import Error from '../UI/Error.svelte'

  export let t = []
  export let b = []
  export let key = '0'
  export let schema_key
  export let form = []
  export let fetchConfig = { type: ValueType.Array, project: null }
  export let buttonlabels = { save: 'Save', cancel: 'Cancel' }
  export let selector = []
  export let headerSchema = []
  export let showdbg = !IS_PRODUCTION
  let options = { disabled: false, notify: true }
  let headers = []
  let initial_form = []
  let form_disabled = true
  // =============================================================================
  // ================================Fetch Form Data =============================
  let project = getContext('project')
  let project_ctx = project ? get(project) || [] : []
  fetchConfig = {
    ...fetchConfig,
    type: ValueType.Array,
    project: project_ctx?.[project_ctx.length - 1]?._key ?? null
  }
  let events = schemaEvents(schema_key)
  let unsub_evt
  let er = ''
  if (!events) er = 'events array must be defined'
  const uid = S.uid
  let data_evt
  if (events[0]) {
    if (key) {
      data_evt = [ET.subscribe, events[0], uid]
      unsub_evt = [ET.unsubscribe, events[0], uid]
    } else {
      data_evt = [ET.get, events[0], uid]
      unsub_evt = []
    }
  }
  let mutate_evt
  if (key) {
    mutate_evt = [ET.update, events[1], uid]
  } else {
    mutate_evt = [ET.insert, events[1], uid]
  }
  let schemaGetEvt = []
  if (!data_evt) {
    schemaGetEvt = [ET.get, E.form_schema_get, key]
  } else {
    schemaGetEvt = []
  }

  if (schemaGetEvt) {
    S.bind$(schemaGetEvt, onDataGet, 1)
  }
  S.bind$(data_evt, onDataGet, 1)
  S.bind$(mutate_evt, onMutateGet, 1)

  function fetch() {
    if (headerSchema.length) {
      onDataGet(headerSchema as [any])
      return
    }
    const filter = [`="${key}"`]
    if (schemaGetEvt && schemaGetEvt.length) {
      const args = ['s', filter, { ...fetchConfig, schema: schema_key }]
      const e1 = [schemaGetEvt, args]
      S.trigger([e1])
    } else {
      if (data_evt && data_evt.length) {
        const args = [filter, [], [], { ...fetchConfig, form: true }] // level: project_data_store[project_data_store.length - 1]?._key ?? ""
        const e1 = [data_evt, args]
        S.trigger([e1])
      }
    }
  }
  fetch()

  let layout = []
  function merge(array1: [], array2: []) {
    for (let i = 0; i < array2.length; i++) {
      if (array1[i] && !array2[i]) {
        array2[i] = array1[i]
      }
    }
    return array2
  }
  let showKey = false
  function onDataGet(d) {
    if (!d[0]) {
      er = d[1]
    } else if (Array.isArray(d[0])) {
      const schema = d[0][0]
      const options_new = d[0][1] ?? {}
      const newOptions = { ...options, ...options_new }
      options = newOptions
      headers = schema
      if (newOptions.buttonlabels) buttonlabels = newOptions.buttonlabels
      if (newOptions.l) layout = newOptions.l
      if (newOptions.k) showKey = newOptions.k
      if (newOptions.replace && key) {
        mutate_evt[0] = ET.replace
        S.bind$(mutate_evt, onMutateGet, 1)
      }
      const form_values = d[1]
      const form_new = onFormDataGetStatic(form_values)
      if (!form_new) {
        er = 'form_values is invalid'
      }
      const new_form = merge(form, form_new)
      form = new_form
      initial_form = clone(new_form)

      form_disabled = options.ds ?? false // options.disabled
    }
  }
  function onFormDataGetStatic(d) {
    if (d.r) {
      const r = d.r.result
      if (r.length) {
        return r[0]
      } else {
        return {}
      }
    } else if (d.n) {
      //d.n.result
    } else if (d.m) {
      const r = d.m.result
      if (r.length) {
        return r[0]
      } else {
        return {}
      }
      //d.m.result
    } else if (d.d) {
      //
    }
  }
  $: {
    if (headerSchema.length) {
      onDataGet(headerSchema as [any])
    }
  }
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
  css_count.increase('submit_buttons')
  css_count.increase(schema_key)
  onDestroy(() => {
    if (key && unsub_evt.length) S.trigger([[unsub_evt, {}]])
    S.unbind_([data_evt, mutate_evt])
    if (schemaGetEvt.length) {
      S.unbind(schemaGetEvt)
    }
    css_count.decrease('submit_buttons')
    css_count.decrease(schema_key)
  })
  // =============================================================================
  // ================================Save Data ===================================
  let emitEvent = true
  function onApply() {
    emitEvent = false
    onSave()
  }
  let isSaving = false
  function onSave() {
    isSaving = true
    const filter = key
      ? [`="${fetchConfig.type == ValueType.Object ? form._key : form[0]}"`]
      : null
    // Now auto unsubscribing no need to pass  , ...(key ?  {unsub: data_evt} : {})
    const saveConfig = { ...fetchConfig } // , form: true, schema: schema_key
    if (selector.length) {
      saveConfig['sel'] = selector
    }
    const args = [form, filter, saveConfig]
    if (key) {
      args.push(unsub_evt)
    }
    S.trigger([[mutate_evt, args]])
  }

  function onReset() {
    if (!key) {
      form = clone(initial_form)
    }
  }
  const { addNotification } = getNotificationsContext()
  const dp = createEventDispatcher()
  function onMutateGet(d) {
    isSaving = false
    if (d[0]) {
      const save_msg = view(lensPath(['msg', 'save']), $translation)
      if (options.notify) {
        addNotification({
          text: save_msg,
          position: 'bottom-right',
          type: 'success',
          removeAfter: 4000
        })
      }
      er = ''
      if (emitEvent) {
        dp('successSave', { key: key, d })
      }
      onReset()
    } else {
      er = d[1]
    }
  }

  // =============================================================================
  // ================================Other =======================================
  let mounted = false
  onMount(() => {
    mounted = true
  })
  $: if (mounted) {
    if ($ws_connected) {
      er = ''
    } else {
      er = 'Reconnecting...'
    }
  }

  //$: {console.warn("form", form)}
  let once = true
  let doms = {}
  // Focus first input
  $: {
    if (mounted && once) {
      let index = -1
      let i = -1
      for (i = 0; i < disabled.length; i++) {
        if (!disabled[i]) {
          index = i
          break
        }
      }
      if (index > -1) {
        setTimeout(function() {
          if (doms[index]) doms[index].focus()
        }, 200)
        once = false
      }
    }
  }
  // Fix form values:
  $: {
    if (!key) {
      if (Array.isArray(form)) {
        for (let i = 0; i < form.length; i++) {
          if (Array.isArray(form[i]) && form[i].length > 0) {
            let e = form[i]
            if (Array.isArray(e) && e.length > 0) {
              for (let j = 0; j < e.length; j++) {
                let f = e[j]

                if (typeof f[0] == 'string') {
                  const func = f[0]
                  if (func == 'fnSetContext') {
                    if (f.length > 1) {
                      const key = f[1]
                      form[i] = get(getContext(key))
                      continue
                    }
                  } else if (func == 'fnSetContextKey') {
                    if (f.length > 1) {
                      const key = f[1]
                      let objKey
                      if (f.length > 2) {
                        objKey = f[2]
                      } else {
                        objKey = '_key'
                      }

                      form[i] = get(getContext(key))[objKey]
                      continue
                    }
                  } else if (func == 'fnSetContextKeyInArray') {
                    if (f.length > 1) {
                      const key = f[1]
                      let objKey
                      if (f.length > 2) {
                        objKey = f[2]
                      } else {
                        objKey = '_key'
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
    if (form_disabled_ === true) {
      return true
    } else {
      return disabled[i]
    }
  }
  $: saveLabel = buttonlabels?.save ?? ''
  $: cancelLabel = buttonlabels?.cancel ?? ''
  $: applyLabel = buttonlabels?.apply ?? ''
  let css_loaded = false
  $: {
    if (!css_loaded) {
      if (!$css_loading) {
        css_loaded = true
      }
    }
  }
</script>

{#if css_loaded}
  <Html html={t} />
  {#if showdbg}
    <label>debug</label>
    <input type="checkbox" bind:checked={$showDebug} />
  {/if}
  {#if types.length}
    <form class={schema_key} on:submit|preventDefault={onSave}>

      {#if layout.length}
        {#each layout as lo, loi (lo)}
          {#each lo as i, yi (i)}
            {#if isNumber(i)}
              {#if types[i]}
                <GeneralInput
                  bind:value={form[i]}
                  type={types[i]}
                  label={labels[i]}
                  required={required[i]}
                  disabled={isDisabled(form_disabled, i)}
                  description={description[i]}
                  bind:dom={doms[i]}
                  props={props[i]} />
              {/if}
            {:else if isPlainObj(i)}
              {@html i.l}
            {/if}
          {/each}
          <br />
        {/each}
      {:else}
        {#each form as f, i}
          {#if types[i]}
            <GeneralInput
              {showKey}
              bind:value={f}
              type={types[i]}
              label={labels[i]}
              required={required[i]}
              disabled={isDisabled(form_disabled, i)}
              description={description[i]}
              bind:dom={doms[i]}
              props={props[i]} />
          {/if}
        {/each}
      {/if}

      <SubmitButton {isSaving} label={saveLabel} save={() => {}} />
      {#if applyLabel}
        <SubmitButton
          {isSaving}
          type={'button'}
          label={applyLabel}
          save={onApply} />
      {/if}
      {#if cancelLabel}
        <CancelButton {isSaving} {key} on:close label={cancelLabel} />
      {/if}
      {#if false}
        <button type="button" on:click={onReset}>Reset</button>
      {/if}
    </form>
  {/if}
  <!-- <Error {er} /> -->
  {er}
  {#if $showDebug}{JSON.stringify(form)} options: {JSON.stringify(options)}{/if}
  <Html html={b} />
{/if}
