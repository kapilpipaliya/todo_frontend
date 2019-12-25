<script>
	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e } from './modules/functions.js'
	import * as R from 'ramda'
	import Css from './components/Css.svelte'
	import MenuF from './components/MenuF.svelte'

	// subscribe here with  LoginStatus too.
	import {account} from './modules/global_stores/account.js'
	import {cookie} from './modules/global_stores/cookie.js'
	import {member_settings} from './modules/global_stores/member_settings.js'
	import {menu} from './modules/global_stores/menu.js'
	import {navigation} from './modules/global_stores/navigation.js'
	import {notification} from './modules/global_stores/notification.js'
	import {current_time} from './modules/global_stores/time_store.js'

	import { Router } from 'svelte-router-spa'
	// Routes:
	import Login from './account/login.svelte'
	import Logout from './account/logout.svelte'
	import Register from './account/register.svelte'
	import PublicIndex from './views/public/index.svelte'
	import PublicLayout from './views/public/layout.svelte'
	import AdminLayout from './views/admin/layout.svelte'
	import AdminIndex from './views/admin/index.svelte'
	import EmployeesIndex from './views/admin/employees/index.svelte'
  	import Page from './Page.svelte'

	let mounted = false
	let er = ''
	let binded = false
	let form_schema_evt = [et.get, e.my, e.my_form_schema_get, 9999 ]
	let menu_evt = [et.get, e.my, e.my_form_schema_get, 8888 ]
	let routes  = []
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([form_schema_evt, menu_evt]) })
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	const funcBindingOnce = () => {
	    if (!binded) {
	      S.bind$(form_schema_evt, (d) => {
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
	    	[form_schema_evt, ['routes']],
	    	[menu_evt, ['menu']],
	    	]) 
	    }
  	}

	function userIsAdmin() {
	  //check if user is admin and returns true or false
	  return true
	}

	const modifyComp = (key, obj)=> {
	    switch (obj[key]) {
	    case "PublicLayout": obj[key] = PublicLayout; break;
	    case "AdminLayout": obj[key] = AdminLayout; break;
	    case "Register": obj[key] = Register; break;
	    case "Login": obj[key] = Login; break;
	    case "Logout": obj[key] = Logout; break;
	    case "AdminIndex": obj[key] = AdminIndex; break;
	    case "EmployeesIndex": obj[key] = EmployeesIndex; break;      
	    case "Page": obj[key] = Page; break;  
	  }
	  return obj
	}
	const modifyGuard = (obj) => {
	  if(obj.onlyIf) {
	    switch (obj.onlyIf.guard) {
	      case "userIsAdmin":
	        obj.onlyIf.guard = userIsAdmin;
	        break;    
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