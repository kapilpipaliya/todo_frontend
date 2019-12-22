<script>
	import { Router, Route, Link } from "svelte-routing"
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


<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <a href="/account/register">Register </a>

	<a href="/account/login">Log in </a>
	<a href="/account/logout">Logout </a>

	<div>
	  <a href="#/admin" >Admin </a>
	  <a href="#/admin/design" >Design </a>
	  <br>Global:<br>
	  <a href="#/page?page=schema" >Schema </a>
	  <a href="#/page?page=confirm">Confirm </a>
	  <a href="#/page?page=session">Session </a>
	  <a href="#/page?page=translation" >Translation </a>
	  <a href="#/page?page=user" >user </a>
	</div>
  </nav>
  <main class="app">
    <Route path="/about">About</Route>
    <Route path="/">Home</Route>
  </main>
</Router>
