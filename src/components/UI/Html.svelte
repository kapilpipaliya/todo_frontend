<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Ws, ws_connected } from '../../ws_events_dispatcher'
  import { ET, E, form_schema_evt } from '../../enums'
  declare let $ws_connected
  export let html = []
  let mounted = false
  let er = ''
  let htmlResult = []
  const template_evt = [ET.get, E.template_list, Ws.uid]
  onMount(() => {
    mounted = true
  })
  onDestroy(() => {
    Ws.unbind_([template_evt])
  })
  Ws.bind$(
    template_evt,
    d => {
      if (d[1]) {
        const result = d[1].r.result
        if (Array.isArray(result)) {
          for (let i = 0; i < result.length; i++) {
            htmlResult.push(result[i][2])
          }
          htmlResult = htmlResult
        }
      }
    },
    1
  )
  if (html.length) {
    Ws.trigger([[template_evt, [[null, join(html)], [], [], { h: false }]]])
  }
  $: if (mounted) {
    if ($ws_connected) {
      er = ''
    } else {
      er = 'Reconnecting...'
    }
  }
  function join(array) {
    if (!array.length) {
      return ''
    }
    if (array.length == 1) {
      return `["${array[0]}"]`
    }
    let r = `"${array[0]}"`
    for (let i = 1; i < html.length; i++) {
      const t = html[i]
      if (t) {
        r += `,"${t}"`
      }
    }
    return `[${r}]`
  }
</script>

{#each htmlResult as h}
  {@html h}
{/each}
