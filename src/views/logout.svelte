<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { Ws, ws_connected } from '../ws_events_dispatcher'
  import { ET, E } from '../enums'
  import Error from '../components/UI/Error.svelte'
  declare let $ws_connected
  export let query = {}
  let mounted = false
  let er = ''
  let header = '' // initialised on onMount
  let subtitle = ''
  let loging_out = true
  const fns = [[ET.insert, E.logout, Ws.uid]],
    [logout] = fns
  Ws.bind$(logout, onLogout, 1)
  $: {
    if (mounted) {
      if ($ws_connected) {
        er = ''
        Ws.trigger([[logout, query]])
      } else {
        er = 'Reconnecting...'
      }
    }
  }
  onMount(async () => {
    mounted = true
    header = 'Logging out'
    er = 'Please wait ...'
  })
  onDestroy(() => {
    Ws.unbind_(fns)
  })
  // some functions:============
  function onLogout(d) {
    if (d[0]) {
      loging_out = false
      header = 'Logged out successfully!'
      er = 'Thank you for visiting. See you again soon.'
    } else {
      header = 'Error'
      er = d[1]
    }
  }
</script>

<div class="header">
  <h1>{header}</h1>
  <Error {er} />
</div>
{#if loging_out}
  Logging out...
{:else}
  <div class="signin">
    <p>
      Sign in
      <a href="/account/login">Sign in</a>
      .
    </p>
  </div>
{/if}
