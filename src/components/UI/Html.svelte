<script lang='ts'>
  import { onMount, onDestroy, S, ws_connected, ET,E, form_schema_evt, isLoggedIn as isLoggedInFn } from '../../modules/index'
  declare let $ws_connected
  export let html = []
  let mounted = false
  let er = ''
  let binded = false
  let htmlResult = []
  const template_evt = [ET.get, E.template_list, S.uid ]
  onMount(() => {mounted = true})
  onDestroy(() => {S.unbind_([template_evt]) })
  $: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  function funcBindingOnce() {
    if (!binded) {
      S.bind$(template_evt, (d) => {
        if(d[1]){
          const result = d[1].r.result
          if(Array.isArray(result)){
            for (let i = 0; i < result.length; i++) {
              htmlResult.push(result[i][2])
            }
            htmlResult = htmlResult
          }
        }
      }, 1)
      binded = true
      if(html.length){S.trigger([[template_evt, [[null, join(html)],[],[],{h: false}]] ]) } 
    }
  }
  function join(array){
    if(!array.length){return ''}
    if(array.length == 1){return `["${array[0]}"]` }
    let r = `"${array[0]}"`
    for(let i = 1; i < html.length; i++){
      const t = html[i]
      if(t){
        r += `,"${t}"`
      }
    }
    return `[${r}]`;
  }
</script>
{#each htmlResult as h}
{@html h}
{/each}