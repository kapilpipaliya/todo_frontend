<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import flatpickr from 'flatpickr'
  import { css_count } from '../../../css'
  export let disabled

  const hooks = new Set([
    'onChange',
    'onOpen',
    'onClose',
    'onMonthChange',
    'onYearChange',
    'onReady',
    'onValueUpdate',
    'onDayCreate'
  ])

  export let value = ''
  export let element = null
  export let dateFormat = null

  declare let $$props
  let allProps = $$props

  const options = allProps.options || { enableTime: true }
  const props = Object.assign({}, $$props)
  delete props.options

  let input, fp

  $: if (fp) fp.setDate(value, false, dateFormat)

  css_count.increase('flatpickr')
  onMount(async () => {
    //let flatpickr
    try {
      /*const {default: flatpickr_} =*/ await import(
        'https://unpkg.com/flatpickr/dist/flatpickr.js'
      )
      //flatpickr = flatpickr_
    } catch (err) {
      console.warn(err.message)
      return
    }
    const elem = element || input
    fp = flatpickr(
      elem,
      Object.assign(addHooks(options), element ? { wrap: true } : {})
    )

    return () => {
      fp.destroy()
      css_count.decrease('flatpickr')
    }
  })

  const dispatch = createEventDispatcher()

  $: if (fp)
    for (const [key, val] of Object.entries(addHooks(options))) {
      fp.set(key, val)
    }

  function addHooks(opts: { onChange?: Array<(newValue: any) => void> } = {}) {
    opts = Object.assign({}, opts)

    for (const hook of hooks) {
      const firer = (selectedDates, dateStr, instance) => {
        dispatch(stripOn(hook), [selectedDates, dateStr, instance])
      }

      if (hook in opts) {
        // Hooks must be arrays
        if (!Array.isArray(opts[hook])) opts[hook] = [opts[hook]]

        opts[hook].push(firer)
      } else {
        opts[hook] = [firer]
      }
    }

    if (opts.onChange && !opts.onChange.includes(updateValue))
      opts.onChange.push(updateValue)

    return opts
  }

  function updateValue(newValue) {
    value =
      Array.isArray(newValue) && newValue.length === 1
        ? newValue[0].getTime()
        : newValue.getTime()
  }

  function stripOn(hook) {
    return hook.charAt(2).toLowerCase() + hook.substring(3)
  }
</script>

<slot>
  <input bind:this={input} {...props} {disabled} />
</slot>
