<script>
	import Css from './components/Css.svelte'

	import {account} from './modules/global_stores/account.js'
	import {cookie} from './modules/global_stores/cookie.js'
	import {member_settings} from './modules/global_stores/member_settings.js'
	import {menu} from './modules/global_stores/menu.js'
	import {navigation} from './modules/global_stores/navigation.js'
	import {notification} from './modules/global_stores/notification.js'
	import {current_time} from './modules/global_stores/time_store.js'
	// subscribe here with 
	// LoginStatus.
	import { Router } from 'svelte-router-spa'
	import Login from './account/login.svelte'
	import PublicIndex from './views/public/index.svelte'
	import PublicLayout from './views/public/layout.svelte'
	import AdminLayout from './views/admin/layout.svelte'
	import AdminIndex from './views/admin/index.svelte'
	import EmployeesIndex from './views/admin/employees/index.svelte'
  	import Page from './Page.svelte'
	import * as R from 'ramda'
	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e } from './modules/functions.js'

	let mounted = false
	let er = ''
	let binded = false
	let form_evt = [et.get, e.my, e.my_form_schema_get, 9999 ]
	onMount(async () => {
    	mounted = true
  	})
  	onDestroy(() => {S.trigger([[form_evt, {}]]) })
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	const funcBindingOnce = () => {
	    if (!binded) {
	      S.bind$(form_evt, (d) => {
	      	if(d.length && d[0].routes){
	      		
	      	}
	      }, 1)
	      binded = true
	    }
	    S.trigger([[form_evt, ['routes']]]) 
  	}

	function userIsAdmin() {
	  return true
	  //check if user is admin and returns true or false
	}
	let routes = [
	  {
	    name: '/',
	    component: "PublicLayout"
	  },
	  { name: 'login', component: "Login", layout: "PublicLayout" },
	  {
	    name: 'admin',
	    component: "AdminLayout",
	    onlyIf: { guard: "userIsAdmin", redirect: '/login' },
	    nestedRoutes: [
	      { name: 'index', component: "AdminIndex" },
	      {
	        name: 'employees',
	        component: '',
	        nestedRoutes: [
	          { name: 'index', component: "EmployeesIndex" }
	        ]
	      },
	      {name: '/design', component: "Login"},

	    ]
	  },
	  {name: 'account/login', component: "Login"},
	  {name: 'account/register', component: "Login"},
	  {name: 'account/logout', component: "Login"},

	  {name: 'page/:table', component: "Page"},
	]
	const modifyComp = (obj)=> {
	    switch (obj.component) {
	    case "PublicLayout":
	      obj.component = PublicLayout;
	      break;
	    case "AdminLayout":
	      obj.component = AdminLayout;
	      break;
	    case "Login":
	      obj.component = Login;
	      break;
	    case "AdminIndex":
	      obj.component = AdminIndex;
	      break;
	    case "EmployeesIndex":
	      obj.component = EmployeesIndex;
	      break;      
	    case "Page":
	      obj.component = Page;
	      break;  
	  }
	  return obj
	}
	const modifyLayout = (obj)=>{
	      switch (obj.layout) {
	    case "PublicLayout":
	      obj.layout = PublicLayout;
	      break;
	    case "AdminLayout":
	      obj.component = AdminLayout;
	      break;
	    case "Login":
	      obj.layout = Login;
	      break;
	    case "AdminIndex":
	      obj.layout = AdminIndex;
	      break;
	    case "EmployeesIndex":
	      obj.layout = EmployeesIndex;
	      break;      
	    case "Page":
	      obj.component = Page;
	      break;  
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
		obj = modifyComp(obj)
	  obj = modifyLayout(obj)
	  obj = modifyGuard(obj)
	  if(obj.nestedRoutes){
	    obj.nestedRoutes = R.map((x)=> modifyObj(x), obj.nestedRoutes)
	  }
	  return obj
	}

	routes = R.map((x)=> modifyObj(x), routes)
	

	// import qs from 'qs'
    // import * as R from 'ramda'

    // import {getTableOptions} from './_modules/table_options.js'
    // import {Table} from './_components/index.js'

	// export let query = {}
	let options

	// // on tab page do: 
	// const onClickHandle = e => {
	//   goto(e.target.href, { replaceState: true })
	// }
	/*
	export let accountFilter = {};
	let customFilter = {
	1 : accountFilter
	};
  */
</script>

<Css/>
<Router {routes} />

  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>

    <a href="/account/register">Register </a>
	<a href="/account/login">Log in </a>
	<a href="/account/logout">Logout </a>

	<div>
	  <a href="/admin" >Admin </a>
	  <a href="/admin/design" >Design </a>
	  <br>Global:<br>
	  <a href="/page/schema" >Schema </a>
	  <a href="/page/confirm">Confirm </a>
	  <a href="/page/session">Session </a>
	  <a href="/page/translation" >Translation </a>
	  <a href="/page/user" >user </a>
	  <a href="/page/note" >note </a>
	</div>
  </nav>