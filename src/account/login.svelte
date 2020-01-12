<script>
  import {onMount, S as S_,domainName, event_type as et, events as e, } from '../modules/functions.ts'
  import GeneralForm from '../components/form/Index.svelte'
  export let query = {}
  export let server = ''
  export const loginMutateEvents = (id=0) => {
    return [
      null,
      null,
      [et.mutate, e.account, e.login, id],
    ]
  }
  onMount(()=> {
    // i found logic from: https://github.com/vemarav/subdomains/blob/master/plugin/index.js
    /*
    let hostNameArray = page.host.split('.')
    const sliceLength = domainName ? domainName.split('.').length : 2
    hostNameArray = hostNameArray.slice(0, hostNameArray.length - sliceLength)
    const server = hostNameArray.length ? hostNameArray[0] : ''
    */
  })
  // Todo: When login on subdomain, server field do not show.
</script>
{#if query.message}
  <span class={query.type}>{query.message}</span>
{/if}
<GeneralForm eventsFn={loginMutateEvents} key={null} schema_key={'login'} />