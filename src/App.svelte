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
	import { Router, Route, Link } from "svelte-routing"
	import Page from './Page1.svelte'
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


<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>

    <Link to="/account/register">Register </Link>
	<Link to="/account/login">Log in </Link>
	<Link to="/account/logout">Logout </Link>

	<div>
	  <Link to="/admin" >Admin </Link>
	  <Link to="/admin/design" >Design </Link>
	  <br>Global:<br>
	  <Link to="/page/schema" >Schema </Link>
	  <Link to="/page/confirm">Confirm </Link>
	  <Link to="/page/session">Session </Link>
	  <Link to="/page/translation" >Translation </Link>
	  <Link to="/page/user" >user </Link>
	</div>
  </nav>
  <main class="app">
    <Route path="/account/register">Register</Route>
    <Route path="/account/login">Login</Route>
    <Route path="/account/logout">Logout</Route>

    <Route path="/admin">Admin</Route>
    <Route path="/admin/design">Design</Route>

    <Route path="/page/:table" component="{Page}" />


    <Route path="/about">About</Route>
    <Route path="/">Home</Route>
  </main>
</Router>
