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
    import { routes } from './routes'
	

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
	</div>
  </nav>