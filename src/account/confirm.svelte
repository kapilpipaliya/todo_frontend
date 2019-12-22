<script context="module">
  import {
    S as S_, ws_connected,
    ws_todo,
    domainName,
    isLoggedIn,
    event_type,
    events,
  } from '../_modules/functions.js'

  export async function preload(page, session) {
    //let S; if (typeof S_ == "function") { S = new S_(ws_todo, this.req, this.res); } else { S = S_; }
    //const top_menu = {};
    //const footerData = {};
    const headerData = { company: 'Project Management' }
    return { query: page.query, headerData }
  }
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { goto } from '@sapper/app'

  import { S } from '../_modules/functions.js'

  export let query = {}
  export let headerData = {}

  let mounted = false
  let binded = false

  let er = ''

  let header = ''
  let subtitle = ''

  let confirming = true
  let result_title = ''

  const fns = [
      [event_type.mutate, events.account, events.confirm_email, 0],
      [event_type.subscribe, events.account, events.confirm_email_status, 0],
      [event_type.unsubscribe, events.account, events.confirm_email_status, 0],
    ],
    [doconfirm, sub, unsub] = fns

  const bindOnce = () => {
    if (!binded) {
      S.bind$(sub, onSubGet, 1)
      binded = true
    }
  }

  // this function send subscription request everytime ws connection open
  $: {
    if (mounted) {
      if ($ws_connected) {
        er = ''
        bindOnce()
        S.trigger([[sub, {}]])

        if (query.token) {
          S.trigger([[doconfirm, query]])
        }
      } else {
        er = 'Reconnecting...'
      }
    }
  }

  onMount(async () => {
    mounted = true

    if (query.token) {
      header = 'Confirming'
      subtitle = 'Please wait ...'
    } else {
      header = 'Email Verification'
      subtitle = 'Please check your inbox to verify email.'
    }
  })

  onDestroy(() => {
    if (process.browser) {
      S.trigger([[unsub, {}]])
      S.unbind_(fns)
    }
  })

  // some functions:============
  function saveCookie(d) {
    // read more: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
    document.cookie = `time=${d.cookie}; path=/; max-age=${d.max_age}`
    goto(d.redirect_url)
  }

  function onSubGet([d]) {
    if (d.ok) {
      confirming = false
      result_title = 'Success'
      er = 'Your Email is confirmed.'
      saveCookie(d)
    } else {
      result_title = 'Error'
      er = d.error
    }
  }
</script>

<style>

</style>

<svelte:head>
  <title>{headerData.company} - Confirm Email</title>
</svelte:head>

{#if confirming}
  <div class="header">
    <h1>{header}</h1>
    <p>{subtitle}</p>
  </div>
{:else}
  <div class="header">
    <h1>{result_title}</h1>
    <p>{er}</p>
  </div>

  <div class="signin">
    <p>
      Sign in
      <a href="account/login">Sign in</a>
      .
    </p>
  </div>
{/if}
