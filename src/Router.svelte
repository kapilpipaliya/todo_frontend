<script lang='ts'>
  import Page from './components/Page.svelte'
	import FormWrapper from './components/FormWrapper.svelte'
	import Logout from './views/account/logout.svelte'
	import Confirm from './views/account/confirm.svelte'
	import Home from './views/public/home.svelte'
	import PublicLayout from './views/public/layout.svelte'
	import AdminLayout from './views/admin/layout.svelte'
	import AdminIndex from './views/admin/index.svelte'
	import OrganizationLayout from './views/organization/layout.svelte'
	import OrganizationIndex from './views/organization/index.svelte'
	import ProjectLayout from './views/project/layout.svelte'
	import ProjectIndex from './views/project/index.svelte'
	import { Router } from './components/svelte-router-spa/src/index'
	import { onDestroy, S, form_schema_evt, isLoggedIn, Unique, R, RD } from './modules/index'
	let routes  = []
	onDestroy(S.bindT(form_schema_evt(Unique.id), (d) => {if(d[0].routes){routes = RD.map((x) => modifyObj(x), d[0].routes) } }, ['routes'], 1))
	async function isLoggedInFn() {return (await isLoggedIn(S))[0] }
	async function isNotLoggedIn() {return !(await isLoggedIn(S))[0] }
	async function userIsAdmin() {return true }
	const getcomp = (k) => { 
    if(k == '' || k == undefined) return
    switch(k) {
    case "PublicLayout": return PublicLayout;
    case "Home": return Home;   
    case "Page": return Page;  
    case "Form": return FormWrapper;
    case "Logout": return Logout;
    case "Confirm": return Confirm;
    case "AdminLayout": return AdminLayout;
    case "AdminIndex": return AdminIndex;
    case "OrganizationLayout": return OrganizationLayout;
    case "OrganizationIndex": return OrganizationIndex;
    case "ProjectLayout": return ProjectLayout;
    case "ProjectIndex": return ProjectIndex;
    default:
    console.error("No Component Found For key: ", k) } }
	const getguard = k => { switch(k) {
		case "userIsAdmin": return userIsAdmin;
		case "isNotLoggedIn": return isNotLoggedIn;
		case "isLoggedIn": return isLoggedInFn;
		default: console.error("No Guard Found For key: ", k) }}
	const modifyComp = R.curry((k,o) => {let c = getcomp(o[k]); if(c) o[k] = c; return o })
	const modifyGuard = (o) => {if(o.onlyIf) {let g = getguard(o.onlyIf.guard); if(g) o.onlyIf.guard = g; } return o }
	const modifyObj = (o) => { o = R.pipe(modifyComp('component'), modifyComp('layout'), modifyGuard)(o)
	  if(o.nestedRoutes) o.nestedRoutes = RD.map((x) => modifyObj(x), o.nestedRoutes); return o }
</script>
{#if routes.length} <Router {routes} /> {:else} Loading... {/if}