<script lang='ts'>
	import {translation} from './modules/global_stores/translation'
	import cookie from './modules/ws_events/cookie'
	import {member_settings} from './modules/global_stores/member_settings'
	import TopLevelComps from './components/UI/TopLevelComps.svelte'
  import {current_member} from './modules/global_stores/current_member'
  declare let $current_member
  import MenuF from './components/UI/MenuF.svelte'
  import Page from './components/Page.svelte'
  import FormWrapper from './components/FormWrapper.svelte'
  import Logout from './views/account/logout.svelte'
  import Confirm from './views/account/confirm.svelte'
  import Home from './views/public/home.svelte'
  import About from './views/public/contact.svelte'
  import Contact from './views/public/about.svelte'
  import PublicLayout from './views/public/layout.svelte'
  import AdminLayout from './views/admin/layout.svelte'
  import AdminIndex from './views/admin/index.svelte'
  import OrganizationLayout from './views/organization/layout.svelte'
  import OrganizationIndex from './views/organization/index.svelte'
  import ProjectLayout from './views/project/layout.svelte'
  import ProjectIndex from './views/project/index.svelte'
  import { Router } from './components/svelte-router-spa/src/index'
  import { onDestroy, S, form_schema_evt, isLoggedIn, ET,E, R, RD, RA } from './modules/index'
  import Notifications from './components/thirdparty/svelte-notifications/src/index'
  let e$
  $: e$ = $current_member?.email;
  let m$  = []
  let r$  = []
  onDestroy(S.bindT([ET.get, E.my, E.form_schema_get, S.uid ], (d) => {if(d[0]){m$ = d[0] } }, ['menu'], 1))
  onDestroy(S.bindT(form_schema_evt(S.uid), (d) => {if(d[0].routes){r$ = RD.map((x) => modifyObj(x), d[0].routes) } }, ['routes'], 1))
  const modifyObj = o => { 
    const C = {"PublicLayout": PublicLayout, "Home": Home, "Contact": Contact, "About": About,
      "Page": Page, "Form": FormWrapper,
      "Logout": Logout, "Confirm": Confirm,
      "AdminLayout": AdminLayout, "AdminIndex": AdminIndex,
      "OrganizationLayout": OrganizationLayout, "OrganizationIndex": OrganizationIndex,
      "ProjectLayout": ProjectLayout, "ProjectIndex": ProjectIndex  }
    const G = {"userIsAdmin": ()=>true, "isNotLoggedIn": async() => !(await isLoggedIn(S))[0], "isLoggedIn": async() => (await isLoggedIn(S))[0], }
    const get_c = k => { if(k == '' || k == undefined) return; const c = C[k]; if(!c) console.error("No Component Found For key: ", k); return c }
    const get_g = k => {const c = G[k]; if(!c) console.error("No Guard Found For key: ", k); return c }
    const mod_c = R.curry((k,o) => {let c = get_c(o[k]); if(c) o[k] = c; return o })
    const mod_g = o => {if(o.onlyIf) {let g = get_g(o.onlyIf.guard); if(g) o.onlyIf.guard = g; } return o }
    const mod_n = o => {if(o.nestedRoutes) o.nestedRoutes = RD.map((x) => modifyObj(x), o.nestedRoutes); return o }
    o = R.pipe(mod_c('component'), mod_c('layout'), mod_g, mod_n)(o); return o }
</script>
<Notifications>
  <TopLevelComps/>
  <nav>
    {#if e$} Current User: {e$} {/if}
    {#if m$.navData} <MenuF menu={m$.navData.account}/> {/if}
    {#if m$.navData} <MenuF menu={m$.navData.global}/> {/if}
    {#if m$.navData} <MenuF menu={m$.navData.admin}/> {/if}
  </nav>
  {#if r$.length} <Router routes={r$} /> {:else} Loading... {/if}
</Notifications>