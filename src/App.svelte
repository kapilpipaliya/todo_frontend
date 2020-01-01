<script lang='ts'>
	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e, form_schema_evt, isLoggedIn as isLoggedInFn } from './modules/functions.ts'
	import * as R from 'ramda'
	import Css from './components/Css.svelte'
	import MenuF from './components/MenuF.svelte'

	// subscribe here with  LoginStatus too.
	import {account} from './modules/global_stores/account.ts'
	import {cookie} from './modules/global_stores/cookie.ts'
	import {member_settings} from './modules/global_stores/member_settings.ts'
	import {menu} from './modules/global_stores/menu.ts'
	import {navigation} from './modules/global_stores/navigation.ts'
	import {notification} from './modules/global_stores/notification.ts'
	import {current_time} from './modules/global_stores/time_store.ts'
	import {translation} from './modules/global_stores/translation.ts'

	import { Router } from './components/svelte-router-spa/src/index.ts'
	// Routes:
  	import Page from './Page.svelte'
	// account:
	import Login from './account/login.svelte'
	import Logout from './account/logout.svelte'
	import Register from './account/register.svelte'
	import Confirm from './account/confirm.svelte'

	// admin:
	import PublicIndex from './views/public/index.svelte'
	import PublicLayout from './views/public/layout.svelte'
	import AdminLayout from './views/admin/layout.svelte'
	import AdminIndex from './views/admin/index.svelte'
	import EmployeesIndex from './views/admin/employees/index.svelte'

	// organization:
	import OrganizationLayout from './views/organization/layout.svelte'
	import OrganizationIndex from './views/organization/index.svelte'


	let mounted = false
	let er = ''
	let binded = false
	const menu_form_evt = form_schema_evt(9999)
	const menu_evt = [et.get, e.my, e.form_schema_get, 8888 ]
	let routes  = []
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_form_evt, menu_evt]) })
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	function funcBindingOnce() {
	    if (!binded) {
	      S.bind$(menu_form_evt, (d) => {
	      	if(d[0].length && d[0][0].routes){
	      		routes = R.map((x)=> modifyObj(x), d[0][0].routes)
	      	}
	      }, 1)
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		menus = d[0][0]
	      	}
	      }, 1)
	      binded = true
          S.trigger([
	    	[menu_form_evt, ['routes']],
	    	[menu_evt, ['menu']],
	    	]) 
	    }
  	}


  	async function isLoggedIn() {
  		const auth = await isLoggedInFn(S)
    	return auth.ok
  	}
    
  	async function isNotLoggedIn() {
  		const auth = await isLoggedInFn(S)
  		console.log(!auth.ok)
    	return !auth.ok
  	}

	function userIsAdmin() {
	  //check if user is admin and returns true or false
	  return true
	}

	const modifyComp = (key, obj)=> {
	    switch (obj[key]) {
	    case "Page": obj[key] = Page; break;  
	    case "PublicLayout": obj[key] = PublicLayout; break;
	    case "Register": obj[key] = Register; break;
	    case "Login": obj[key] = Login; break;
	    case "Logout": obj[key] = Logout; break;
	    case "Confirm": obj[key] = Confirm; break;
	    case "AdminLayout": obj[key] = AdminLayout; break;
	    case "AdminIndex": obj[key] = AdminIndex; break;
	    case "EmployeesIndex": obj[key] = EmployeesIndex; break;
	    case "OrganizationLayout": obj[key] = OrganizationLayout; break;
	    case "OrganizationIndex": obj[key] = OrganizationIndex; break;
	  }
	  return obj
	}
	const modifyGuard = (obj) => {
	  if(obj.onlyIf) {
	    switch (obj.onlyIf.guard) {
	      case "userIsAdmin": obj.onlyIf.guard = userIsAdmin; break;    
	      case "isNotLoggedIn": obj.onlyIf.guard = isNotLoggedIn; break;    
	      case "isLoggedIn": obj.onlyIf.guard = isLoggedIn; break;    
	    }
	  }
	  return obj
	}
	const modifyObj = (obj) => {
	  obj = modifyComp('component', obj)
	  obj = modifyComp('layout', obj)
	  obj = modifyGuard(obj)
	  if(obj.nestedRoutes){
	    obj.nestedRoutes = R.map((x)=> modifyObj(x), obj.nestedRoutes)
	  }
	  return obj
	}
	// import qs from 'qs'

	// // on tab page do: 
	// const onClickHandle = e => {
	//   goto(e.target.href, { replaceState: true })
	// }
</script>

<Css/>

<nav>
	<div>
		<a href="/">Home</a>
		<a href="/about">About</a>
	</div>

	{#if menus.navData}
		<MenuF menu={menus.navData.account}/>
	{/if}

	{#if menus.navData}
		<MenuF menu={menus.navData.global}/>
	{/if}

	{#if menus.navData}
		<MenuF menu={menus.navData.admin}/>
	{/if}
</nav>

{#if routes.length}
	<Router {routes} />
{/if}