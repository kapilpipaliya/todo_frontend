<script lang='ts'>
  // same as confirm page.
  import { onMount, onDestroy, createEventDispatcher, S, ws_todo, isLoggedIn, event_type as et, events as e, ws_connected, Unique } from '../modules/index'
  import Error from '../components/UI/Error.svelte'
  declare let $ws_connected
  // export let categories = [];
  // export let footerData = {};
  // export let headerData = {};
  export let query = {}

  let mounted = false
  let binded = false

  let er = ''

  let header = '' // initialised on onMount
  let subtitle = ''

  let loging_out = true

  const fns = [[et.insert, e.account, e.logout, Unique.id]],
    [logout] = fns

  const runOnce = () => {
    if (!binded) {
      S.bind$(logout, onLogout, 1)
      binded = true
    }
  }

  // this function send subscription request everytime ws connection open
  $: {
    if (mounted) {
      if ($ws_connected) {
        er = ''
        runOnce()
        // S.trigger([[ sub, {} ]]);

        S.trigger([[logout, query]])
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
      S.unbind_(fns)
  })

  // some functions:============
  function onLogout(d) {
    if (d.ok) {
      loging_out = false
      header = 'Logged out successfully!'
      er = 'Thank you for visiting. See you again soon.'
    } else {
      header = 'Error'
      er = d.error
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
