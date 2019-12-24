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
    let S
    if (typeof S_ == 'function') {
      S = new S_(ws_todo, this.req, this.res)
    } else {
      S = S_
    }

    // 1. If subdomain open this page move to main page:
    // i found logic from: https://github.com/vemarav/subdomains/blob/master/plugin/index.js
    let hostNameArray = page.host.split('.')
    const sliceLength = domainName ? domainName.split('.').length : 2
    hostNameArray = hostNameArray.slice(0, hostNameArray.length - sliceLength)
    if (hostNameArray.length)
      this.redirect(302, 'http://' + domainName + '/account/register')

    // 2. If already logged in, just redirecting to '/', can be improved...
    const redirect_url = '/'
    const auth = await isLoggedIn(S)
    if (auth.ok) {
      this.redirect(302, redirect_url)
    }

    // 3. Fetch data...
    const top_menu = {}
    const footerData = {}
    const headerData = { company: 'Project Management' }
    return { query: page.query, headerData }
  }
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import GeneralForm from '../components/form/Index.svelte'

  const dp = createEventDispatcher()
  import { S } from '../modules/functions.js'

  export let query = {}
  export let headerData = {}

  //let form = { email: '', pass: '' }

  export const registerMutateEvents = (id=0) => {
    return [
      null,
      [event_type.get, events.my, events.my_form_schema_get, id ],
      [event_type.mutate, events.account, events.register_user, id],
    ]
}
</script>

<svelte:head>
  <title>{headerData.company} - Register</title>
</svelte:head>

{#if query.message}
  <span class={query.type}>{query.message}</span>
{/if}

<GeneralForm eventsFn={registerMutateEvents} key={null} schema_key={'register'} />
<p>
  By creating an account you agree to our
  <a href="page/privacy">Terms & Privacy</a>
  .
</p>

<div class="signin">
  <p>
    Already have an account?
    <a href="account/login">Sign in</a>
    .
  </p>
  <p>An account is needed to purchase a product</p>
</div>
