<script lang="ts">
  /**
   * Wrap everything inside Notification Component
   * display public menu
   * display auth or guest menu
   * display global menu on developement
   * display home menu
   * display routes when loaded else show load awesome circles(but its not displayed because of lagging css)
   *
   * Internal:
   * remove template.html's loading svg
   * fetch side_menu and routes
   * replace routes component(Heart of the app)


   * todo\ Make all project follow The A11Y Project https://a11yproject.com/
   */
  import { onMount, onDestroy } from 'svelte'
  import { curry, pipe } from 'ramda'
  import { map } from 'rambda'
  import { translation } from './translation'
  import { current_member } from './current_member'
  declare let $current_member
  import { css_loading, css_count } from './css'
  declare let $css_loading
  import TopLevelComps from './components/UI/TopLevelComps.svelte'
  import { IS_PRODUCTION, ET, E, form_schema_evt } from './enums'
  import { S } from './ws_events_dispatcher'
  import TreeSidebar from './components/UI/TreeSidebar.svelte'
  import LoadAwesome from './components/UI/LoadAwesome.svelte'
  import { Router } from '../thirdparty/svelte-router-spa/index'
  import Notifications from '../thirdparty/svelte-notifications/src/index'

  import Page from './components/Page.svelte'
  import FormWrapper from './components/FormWrapper.svelte'
  import Logout from './views/logout.svelte'
  import Confirm from './views/confirm.svelte'
  import Home from './views/home.svelte'
  import About from './views/about.svelte'
  import Contact from './views/contact.svelte'
  import PublicLayout from './views/public_layout.svelte'
  import AdminLayout from './views/admin_layout.svelte'
  import AdminIndex from './views/admin_index.svelte'
  import OrganizationLayout from './views/org_layout.svelte'
  import OrganizationIndex from './views/org_index.svelte'
  import ProjectLayout from './views/project_layout.svelte'
  import ProjectIndex from './views/project_index.svelte'
  import MyPage from './views/my_page.svelte'
  import AccountLayout from './views/account_layout.svelte'

  css_count.increase('all_menu')
  let e$
  $: e$ = $current_member?.email
  let mS$: {}
  let r$ = []

  onMount(() => {
    const loading_div = document.getElementsByClassName(
      'loading-placeholder'
    )[0]
    if (loading_div) loading_div.remove()
  })

  onDestroy(
    S.bindT(
      [ET.get, E.form_schema_get, S.uid],
      d => {
        if (d[0]) mS$ = d[0]
      },
      ['side_menu'],
      0
    )
  )
  onDestroy(
    S.bindT(
      form_schema_evt(S.uid),
      d => {
        if (d[0].routes) r$ = map(x => modifyObj(x), d[0].routes)
      },
      ['routes'],
      0
    )
  )
  const isLoggedIn = async S =>
    await new Promise((resolve, reject) => {
      S.bindT(
        [ET.get, E.is_logged_in, S.uid],
        (d: [[]]) => {
          resolve(d)
        },
        null
      )
    })

  const modifyObj = o => {
    const C = {
      PublicLayout: PublicLayout,
      Home: Home,
      Contact: Contact,
      About: About,
      Page: Page,
      Form: FormWrapper,
      Logout: Logout,
      Confirm: Confirm,
      AdminLayout: AdminLayout,
      AdminIndex: AdminIndex,
      OrganizationLayout: OrganizationLayout,
      OrganizationIndex: OrganizationIndex,
      ProjectLayout: ProjectLayout,
      ProjectIndex: ProjectIndex,
      MyPage: MyPage,
      AccountLayout: AccountLayout
    }
    const G = {
      userIsAdmin: () => true,
      isNotLoggedIn: async () => !(await isLoggedIn(S))[0],
      isLoggedIn: async () => (await isLoggedIn(S))[0]
    }
    const get_c = k => {
      if (k == '' || k == undefined) return
      const c = C[k]
      if (!c) console.error('No Component Found For key: ', k)
      return c
    }
    const get_g = k => {
      const c = G[k]
      if (!c) console.error('No Guard Found For key: ', k)
      return c
    }
    const mod_c = curry((k, o) => {
      let c = get_c(o[k])
      if (c) o[k] = c
      return o
    })
    const mod_g = o => {
      if (o.onlyIf) {
        let g = get_g(o.onlyIf.guard)
        if (g) o.onlyIf.guard = g
      }
      return o
    }
    const mod_n = o => {
      if (o.nestedRoutes)
        o.nestedRoutes = map(x => modifyObj(x), o.nestedRoutes)
      return o
    }
    o = pipe(mod_c('component'), mod_c('layout'), mod_g, mod_n)(o)
    return o
  }
  let css_loaded = false
  $: {
    if (!css_loaded) {
      if (!$css_loading) {
        css_loaded = true
      }
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
</script>

<Notifications>
  {#if css_loaded}
    <TopLevelComps />
    <nav>
      {#if mS$}
        <TreeSidebar class="public" menu={mS$.public} />
        {#if e$}
          Logged In: {e$}
          <TreeSidebar class="top_right" menu={mS$.top_right} />
        {:else}
          <TreeSidebar class="guest" menu={mS$.guest} />
        {/if}
        {#if e$}
          {#if !IS_PRODUCTION}
            <TreeSidebar class="global" menu={mS$.global} />
          {/if}
          <TreeSidebar class="home" menu={mS$.home} />
        {/if}
      {/if}
    </nav>
  {/if}
  {#if r$.length}
    <Router routes={r$} />
  {:else}
    <LoadAwesome />
  {/if}
</Notifications>
