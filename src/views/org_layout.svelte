<script lang="ts">
  import { onMount, onDestroy, getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { S, ws_connected } from '../ws_events_dispatcher'
  import { ET, E } from '../events'
  import { ValueType } from '../enums'
  declare let $ws_connected
  import { clone } from 'rambda'
  import { Route } from '../components/svelte-router-spa/src/index'
  import TreeSidebar from '../components/UI/TreeSidebar.svelte'
  import UrlPattern from 'url-pattern'
  import Skeleton from '../components/UI/Skeleton.svelte'
  export let currentRoute
  const org_id = currentRoute.namedParams.org
  const org_id_ctx = writable(org_id)
  const org_data_ctx = writable({})
  declare let $org_data_ctx
  setContext('org_id', org_id_ctx)
  setContext('org_data', org_data_ctx)
  const project_ctx = writable([])
  declare let $project_ctx
  setContext('project', project_ctx)
  let mounted = false
  let er = ''
  let binded = false
  let fetch_data = false
  let org_fetch_evt = [ET.get, E.organization_list, S.uid]
  let menu_evt = [ET.get, E.form_schema_get, S.uid]
  let menus = []
  onMount(() => {
    mounted = true
  })
  onDestroy(() => {
    S.unbind_([menu_evt])
    // be very careful: top level component unmount first.
    // console.warn('organization unmount')
    $project_ctx.pop()
  })
  $: if (mounted) {
    if ($ws_connected) {
      er = ''
      funcBindingOnce()
    } else {
      er = 'Reconnecting...'
    }
  }
  class Menu {
    public menu = []
  }
  const m = new Menu()
  function funcBindingOnce() {
    if (!binded) {
      S.bind$(
        org_fetch_evt,
        d => {
          const result = d[1].r.result
          if (result.length == 0) {
            console.warn('no organization found')
          } else if (result[0]) {
            const org_data = result[0]
            $org_data_ctx = org_data
            $project_ctx = [org_data]
            fetch_data = true
            return
          }
          console.warn('cant set organization data')
        },
        1
      )
      S.bind$(
        menu_evt,
        d => {
          if (d[0]) {
            if (d[0]) {
              m.menu = d[0].organization
              menus = processMenu(clone(m.menu), org_id)
              return
            }
            console.warn('cant set menu')
          }
        },
        1
      )
      binded = true
      if (org_id) {
        const args = [
          [null, `="${org_id}"`],
          [],
          [0, 0, 1],
          { type: ValueType.Object }
        ]
        S.trigger([
          [org_fetch_evt, args],
          [menu_evt, ['side_menu']]
        ])
      } else {
        er = 'Please Select Organization'
        console.warn('Organization key is invalid')
      }
    }
  }
  function processMenu(menu_, org) {
    if (!org) {
      console.warn('org key must not be empty when processing menu')
      return []
    }
    for (let x of menu_) {
      x.path = new UrlPattern(x.path).stringify({ org })
      if (x.children) {
        x.children = processMenu(x.children, org)
      }
    }
    return menu_
  }
  // enable this when need:
  //$: {menus = processMenu(R.clone(m.menu), org_id) }
</script>

ORGANIZATION LAYOUT
<div style="display: flex">
  <h4>Selected Organization:&nbsp</h4>
  <h3>{org_id}</h3>
</div>
<div style="display: flex">
  <div>
    <TreeSidebar menu={menus} />
  </div>
  {#if fetch_data}
    <Route {currentRoute} />
  {:else}
    <Skeleton />
  {/if}
</div>
