<script lang='ts'>
	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e, form_schema_evt, isLoggedIn as isLoggedInFn, Unique } from './modules/index.ts'
	import * as R from 'ramda'

	import { Router } from './components/svelte-router-spa/src/index.ts'

	import Css from './components/Css.svelte'
	import MenuF from './components/MenuF.svelte'

// stores:
	import {maintenance} from './modules/global_stores/maintenance.ts'
	import {translation} from './modules/global_stores/translation.ts'
	import {notification} from './modules/global_stores/notification.ts'
	import {cookie} from './modules/global_stores/cookie.ts'
	import {navigation} from './modules/global_stores/navigation.ts'

	import {account} from './modules/global_stores/account.ts'
	import {member_settings} from './modules/global_stores/member_settings.ts'
	import {menu} from './modules/global_stores/menu.ts'
	import {current_time} from './modules/global_stores/time_store.ts'
	//import {default_filter} from './modules/global_stores/default_filter.ts'
	//import {default_form} from './modules/global_stores/default_form.ts'
	import {project_id, project_data} from './modules/global_stores/project.ts'
	import {current_member} from './modules/global_stores/current_member.ts'

// Routes:
  	import Page from './components/Page.svelte'
	import FormWrapper from './components/FormWrapper.svelte'
	// account:
	import Logout from './account/logout.svelte'
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

	// project:
	import ProjectLayout from './views/project/layout.svelte'
	import ProjectIndex from './views/project/index.svelte'

	// other

	import { NotificationDisplay } from './components/index.ts'
	let n
	
	let mounted = false
	let er = ''
	let binded = false
	const menu_form_evt = form_schema_evt(Unique.id)
	const menu_evt = [et.get, e.my, e.form_schema_get, Unique.id ]
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
    	return auth[0]
  	}

  	async function isNotLoggedIn() {
  		const auth = await isLoggedInFn(S)
    	return !auth[0]
  	}

	async function userIsAdmin() {
	  //check if user is admin and returns true or false
	  return true
	}

	const modifyComp = (key, obj)=> {		
	    switch (obj[key]) {
	    case "Page": obj[key] = Page; break;  
	    case "PublicLayout": obj[key] = PublicLayout; break;
	    
	    case "Form": obj[key] = FormWrapper; break;
	    
	    case "Logout": obj[key] = Logout; break;
	    case "Confirm": obj[key] = Confirm; break;
	    case "AdminLayout": obj[key] = AdminLayout; break;
	    case "AdminIndex": obj[key] = AdminIndex; break;
	    case "EmployeesIndex": obj[key] = EmployeesIndex; break;
	    case "OrganizationLayout": obj[key] = OrganizationLayout; break;
	    case "OrganizationIndex": obj[key] = OrganizationIndex; break;
	    case "ProjectLayout": obj[key] = ProjectLayout; break;
	    case "ProjectIndex": obj[key] = ProjectIndex; break;
	    default:
	    if(key === 'layout' || key === 'component' || key == ''){
			// No error
		} else {
	    	console.error("No Component Found For: ", obj, " | key: ", key)
		}
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

	/* No static default_filter and default_form
	$: {
		$default_filter = {
		  project: [null, $project_data[0]?._key ?? null],
		  work_package: [null, $project_data[0]?._key ?? null, $project_data[1]?._key ?? null],
		}
	}
	$: {
		$default_form = {
		  project: [null, $project_data[0]?._key ?? null],
		  work_package: [null, $project_data[0]?._key ?? null, $project_data[1]?._key ?? null]
		}
	}*/

	$: level = $current_member?.level;
</script>

<Css/>

{#if $maintenance}
	server is going down for sheduled maintenance
{/if}

<NotificationDisplay bind:this={n} />

<nav>
	<div>
		<a href="/">Home</a>
		<a href="/about">About</a>
	</div>
	Current User Level: {level}

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
