<script lang="ts">
  import { Route } from '../../thirdparty/svelte-router-spa/index'
  import { onMount, onDestroy } from 'svelte'
  import { ET, E } from '../enums'
  import { S, ws_connected } from '../ws_events_dispatcher'
  declare let $ws_connected
  import TreeSidebar from '../components/UI/TreeSidebar.svelte'
  import Skeleton from '../components/UI/Skeleton.svelte'
  export let currentRoute
  let mounted = false
  let er = ''
  let fetch_data = false
  let menu_evt = [ET.get, E.form_schema_get, S.uid]
  let menus = []
  onMount(() => {
    mounted = true
  })
  onDestroy(() => {
    S.unbind_([menu_evt])
  })
  S.bind$(
    menu_evt,
    d => {
      if (d[0]) {
        menus = d[0]
        fetch_data = true // not important on menu
      }
    },
    1
  )
  $: if (mounted) {
    if ($ws_connected) {
      er = ''
      S.trigger([[menu_evt, ['side_menu']]])
    } else {
      er = 'Reconnecting...'
    }
  }
</script>

ADMIN LAYOUT
<div style="display: flex">
  <div>
    {#if menus.admin}
      <TreeSidebar menu={menus.admin} />
    {/if}
  </div>
  {#if fetch_data}
    <Route {currentRoute} />
  {:else}
    <Skeleton />
  {/if}
</div>
