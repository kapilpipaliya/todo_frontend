<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { ET, E } from '../enums'
  import { S, ws_connected } from '../ws_events_dispatcher'
  import Error from '../components/UI/Error.svelte'
  export let currentRoute
  let mounted = false
  let er = ''
  let header = ''
  let subtitle = ''
  let confirming = true
  let result_title = ''
  const fns = [
      [ET.insert, E.confirm_email, S.uid],
      [ET.subscribe, E.confirm_email_status, S.uid],
      [ET.unsubscribe, E.confirm_email_status, S.uid]
    ],
    [doconfirm, sub, unsub] = fns
  S.bind$(sub, onSubGet, 1)
  $: {
    if (mounted) {
      if ($ws_connected) {
        er = ''
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
