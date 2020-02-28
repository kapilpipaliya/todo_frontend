<script>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, event_type as et, events as e, Unique } from '../modules/index'
  import Error from '../components/UI/Error.svelte'
  export let currentRoute

  let mounted = false
  let binded = false

  let er = ''

  let header = ''
  let subtitle = ''

  let confirming = true
  let result_title = ''

  const fns = [
      [et.insert, e.account, e.confirm_email, Unique.id],
      [et.subscribe, e.account, e.confirm_email_status, Unique.id],
      [et.unsubscribe, e.account, e.confirm_email_status, Unique.id],
    ],
    [doconfirm, sub, unsub] = fns

  const runOnce = () => {
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
        runOnce()
        S.trigger([[sub, {}]])

        if (currentRoute.queryParams.token) {
          S.trigger([[doconfirm, currentRoute.queryParams]])
        }
      } else {
        er = 'Reconnecting...'
      }
    }
  }

  onMount(async () => {
    mounted = true

    if (currentRoute.queryParams.token) {
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
  function onSubGet(d) {
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



{#if confirming}
  <div class="header">
    <h1>{header}</h1>
    <p>{subtitle}</p>
  </div>
{:else}
  <div class="header">
    <h1>{result_title}</h1>
    <Error {er} />
  </div>

  <div class="signin">
    <p>
      Sign in
      <a href="account/login">Sign in</a>
      .
    </p>
  </div>
{/if}
