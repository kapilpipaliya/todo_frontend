<script context="module">
  import {
    S as S_,
    ws_todo,
    domainName,
    isLoggedIn,
    event_type,
    events,
  } from '../modules/functions.js'
  export async function preload(page, session) {
    const redirect_url = '/dashboard'
    let S
    if (typeof S_ == 'function') {
      S = new S_(ws_todo, this.req, this.res)
    } else {
      S = S_
    }
    const auth = await isLoggedIn(S)
    if (auth.ok) {
      this.redirect(302, redirect_url)
    }

    // i found logic from: https://github.com/vemarav/subdomains/blob/master/plugin/index.js
    let hostNameArray = page.host.split('.')
    const sliceLength = domainName ? domainName.split('.').length : 2
    hostNameArray = hostNameArray.slice(0, hostNameArray.length - sliceLength)
    const server = hostNameArray.length ? hostNameArray[0] : ''

    const categories = {} // top menu
    const footerData = {}
    const headerData = { company: 'Project Management' }
    return { query: page.query, headerData, server }
  }
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import GeneralForm from '../components/form/Index.svelte'

  // export let categories = [];
  // export let footerData = {};
  // export let headerData = {};

  export let query = {}
  export let headerData = {}
  export let server = ''

  //let form = { email: '', pass: '', server }

  export const loginMutateEvents = (id=0) => {
    return [
      [event_type.get, events.my, events.my_form_schema_get, id ],
      null,
      [event_type.mutate, events.account, events.login, id],
      null,
    ]
}

  // Todo: When login on subdomain, server field do not show.
</script>

<svelte:head>
  <title>{headerData.company} - Login</title>
</svelte:head>

{#if query.message}
  <span class={query.type}>{query.message}</span>
{/if}

<GeneralForm mutateEvents={loginMutateEvents} key={null} schema_key={'login'} />