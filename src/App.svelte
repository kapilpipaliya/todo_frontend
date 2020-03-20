<script lang="ts">
  import { translation } from './translation'
  import cookie from './cookie'
  import { member_settings } from './member_settings'
  import TopLevelComps from './components/UI/TopLevelComps.svelte'
  import { current_member } from './current_member'
  declare let $current_member
  import MenuF from './components/UI/MenuF.svelte'
  import Page from './components/Page.svelte'
  import FormWrapper from './components/FormWrapper.svelte'

  import { Router } from './components/svelte-router-spa/src/index'
  import { ET, E, form_schema_evt } from './events'
  import { onDestroy } from 'svelte'
  import { S } from './ws_events_dispatcher'
  import { isLoggedIn } from './api_helper'
  import { curry, pipe } from 'ramda'
  import { map } from 'rambda'
  import Notifications from '../thirdparty/svelte-notifications/src/index'

  import Logout from './views/logout.svelte'
  import Confirm from './views/confirm.svelte'
  import Home from './views/home.svelte'
  import About from './views/contact.svelte'
  import Contact from './views/about.svelte'
  import PublicLayout from './views/public_layout.svelte'
  import AdminLayout from './views/admin_layout.svelte'
  import AdminIndex from './views/admin_index.svelte'
  import OrganizationLayout from './views/org_layout.svelte'
  import OrganizationIndex from './views/org_index.svelte'
  import ProjectLayout from './views/project_layout.svelte'
  import ProjectIndex from './views/project_index.svelte'

  let e$
  $: e$ = $current_member?.email
  let m$ = []
  let r$ = []
  onDestroy(
    S.bindT(
      [ET.get, E.form_schema_get, S.uid],
      d => {
        if (d[0]) m$ = d[0]
      },
      ['menu'],
      1
    )
  )
  onDestroy(
    S.bindT(
      form_schema_evt(S.uid),
      d => {
        if (d[0].routes) r$ = map(x => modifyObj(x), d[0].routes)
      },
      ['routes'],
      1
    )
  )
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
      ProjectIndex: ProjectIndex
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
</script>

<Notifications>
  <TopLevelComps />
  <nav>
    {#if e$}Current User: {e$}{/if}
    {#if m$.navData}
      <MenuF menu={m$.navData.account} />
    {/if}
    {#if m$.navData}
      <MenuF menu={m$.navData.global} />
    {/if}
    {#if m$.navData}
      <MenuF menu={m$.navData.admin} />
    {/if}
  </nav>
  {#if r$.length}
    <Router routes={r$} />
  {:else}Loading...{/if}
</Notifications>
