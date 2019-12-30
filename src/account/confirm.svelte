<script>
  import {S, ws_connected, event_type as et, events as e, } from '../modules/functions.ts'
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  export let query = {}

  let mounted = false
  let binded = false

  let er = ''

  let header = ''
  let subtitle = ''

  let confirming = true
  let result_title = ''

  const fns = [
      [et.mutate, e.account, e.confirm_email, 0],
      [et.subscribe, e.account, e.confirm_email_status, 0],
      [et.unsubscribe, e.account, e.confirm_email_status, 0],
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
      S.trigger([[unsub, {}]])
      S.unbind_(fns)
  })

  // some functions:============
  function onSubGet([d]) {
    if (d.ok) {
      confirming = false
      result_title = 'Success'
      er = 'Your Email is confirmed.'
    } else {
      result_title = 'Error'
      er = d.error
    }
  }
</script>

<style>

</style>

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
