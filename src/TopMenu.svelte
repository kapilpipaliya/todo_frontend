<script lang="ts">
  /**
   * display public menu
   * display auth or guest menu
   * display global menu on developement
   * display home menu
   * display routes when loaded else show load awesome circles(but its not displayed because of lagging css)
   *
   * Internal:
   * fetch menu
   */
  import { onMount, onDestroy } from 'svelte'
  import { current_member } from './current_member'
  declare let $current_member
  import { css_loading, css_count } from './css'
  declare let $css_loading
  import { ValueType, IS_PRODUCTION, ET, E } from './enums'
  import { S } from './ws_events_dispatcher'
  import TreeSidebar from './components/UI/TreeSidebar.svelte'

  css_count.increase('all_menu')
  let e$
  $: e$ = $current_member?.email
  let items = []
  let public_menu = []
  let top_right_menu = []
  let guest_menu = [
    {
      name: 'Register',
      path: '/super_register'
    },
    {
      name: 'Login',
      path: '/super_login'
    }
  ]
  let global_menu = []
  let home_menu = []
  let subdomain_guest_menu = []
  const isSubdmomain = window.location.hostname.split('.').length > 1

  const getMenuDataGet = all => {
    // if (isLoading) isLoading = false
    const [h, d] = all
    if (h === false) {
      //authorized = false
      //er = d
    }
    if (d.r) {
      items = d.r.result ?? []
    } else if (d.n) {
    } else if (d.m) {
      d.m.result.forEach(mod => {
        const findIndex = items.findIndex(i => {
          return i._key == mod._key
        })
        if (findIndex !== -1) {
          // start, ?deleteCount, ...items
          items.splice(findIndex, 1, mod)
        }
      })
      items = items
    } else if (d.d) {
    }
  }
  const findIdx = name => {
    const findIndex = items.findIndex(i => {
      return i._key == name
    })
    return findIndex
  }
  $: {
    let idx = findIdx('public')
    if (idx > -1) public_menu = items[idx].menu
    idx = findIdx('top_right')
    if (idx > -1) top_right_menu = items[idx].menu
    if (!IS_PRODUCTION) {
      idx = findIdx('global')
      if (idx > -1) global_menu = items[idx].menu
    }
    idx = findIdx('home')
    if (idx > -1) home_menu = items[idx].menu
  }
  onDestroy(
    S.bindT(
      [ET.subscribe, E.menu_list, S.uid],
      d => {
        getMenuDataGet(d)
      },
      [
        [`['top_right', ${!IS_PRODUCTION ? `'global'` : `''`}, 'home']`],
        [],
        [0, 0, 0],
        {
          type: ValueType.Object
        }
      ],
      1
    )
  )

  let css_loaded = false
  $: {
    if (!css_loaded) {
      if (!$css_loading) {
        css_loaded = true
      }
    }
  }
</script>

{#if css_loaded}

  <nav>
    {#if top_right_menu.length}
      Logged In: {e$}
      <TreeSidebar class="top_right" menu={top_right_menu} />
    {/if}

    {#if !IS_PRODUCTION && global_menu.length}
      <TreeSidebar class="global" menu={global_menu} />
    {/if}
    {#if home_menu.length}
      <TreeSidebar class="home" menu={home_menu} />
    {/if}

  </nav>
{/if}
