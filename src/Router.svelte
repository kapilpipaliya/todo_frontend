<script lang='ts'>
	// Routes:
  	import Page from './components/Page.svelte'
	import FormWrapper from './components/FormWrapper.svelte'
	// account:
	import Logout from './account/logout.svelte'
	import Confirm from './account/confirm.svelte'

	// admin:
	import Home from './views/public/home.svelte'
	import PublicLayout from './views/public/layout.svelte'
	import AdminLayout from './views/admin/layout.svelte'
	import AdminIndex from './views/admin/index.svelte'

	// organization:
	import OrganizationLayout from './views/organization/layout.svelte'
	import OrganizationIndex from './views/organization/index.svelte'

	// project:
	import ProjectLayout from './views/project/layout.svelte'
	import ProjectIndex from './views/project/index.svelte'

	import { Router } from './components/svelte-router-spa/src/index'

	import { onDestroy, S, event_type as et,events as e, form_schema_evt, isLoggedIn, Unique } from './modules/index'

	import * as RD from 'rambda'

	let routes  = []

	const schema_get_evt = form_schema_evt(Unique.id)
	S.bind$(schema_get_evt, (d) => {if(d[0].routes){routes = RD.map((x)=> modifyObj(x), d[0].routes) } }, 1)
	S.trigger([[schema_get_evt, ['routes']], ])
  	onDestroy(() => {S.unbind_([schema_get_evt]) })

	// guards:
  	async function isLoggedInFn() {
  		const auth = await isLoggedIn(S)
    	return auth[0]
  	}

  	async function isNotLoggedIn() {
  		const auth = await isLoggedIn(S)
    	return !auth[0]
  	}

	async function userIsAdmin() {
	  //check if user is admin and returns true or false
	  return true
	}

	const modifyComp = (key, obj)=> {		
	    switch (obj[key]) {
	    case "PublicLayout": obj[key] = PublicLayout; break;
	    case "Home": obj[key] = Home; break;
	    
	    case "Page": obj[key] = Page; break;  
	    case "Form": obj[key] = FormWrapper; break;
	    
	    case "Logout": obj[key] = Logout; break;
	    case "Confirm": obj[key] = Confirm; break;
	    
	    case "AdminLayout": obj[key] = AdminLayout; break;
	    case "AdminIndex": obj[key] = AdminIndex; break;
	    
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
	      case "isLoggedIn": obj.onlyIf.guard = isLoggedInFn; break;    
	    }
	  }
	  return obj
	}
	const modifyObj = (obj) => {
	  obj = modifyComp('component', obj)
	  obj = modifyComp('layout', obj)
	  obj = modifyGuard(obj)
	  if(obj.nestedRoutes){
	    obj.nestedRoutes = RD.map((x)=> modifyObj(x), obj.nestedRoutes)
	  }
	  return obj
	}
	// import qs from 'qs'

	// // on tab page do: 
	// const onClickHandle = e => {
	//   goto(e.target.href, { replaceState: true })
	// }
</script>

{#if routes.length}
	<Router {routes} />
{/if}
