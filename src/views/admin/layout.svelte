<script>
  import { Route } from "svelte-router-spa";
  	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e } from '../../modules/functions.js'
  	import * as R from 'ramda'
  	import TreeSidebar from '../../components/TreeSidebar.svelte'

    export let currentRoute;
    export let params

    let mounted = false
	let er = ''
	let binded = false
	let menu_evt = [et.get, e.my, e.my_form_schema_get, 'side_admin_menu' ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_evt]) })
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	const funcBindingOnce = () => {
	    if (!binded) {
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		menus = d[0][0]
	      		console.log(menus)
	      	}
	      }, 1)
	      binded = true
          S.trigger([
	    	[menu_evt, ['side_menu']],
	    	]) 
	    }
  	}
</script>

<h1>Admin Layout</h1>
<div style="display: flex">
  <div>
    {#if menus.admin}
		<TreeSidebar menu={menus.admin}/>
	{/if}
  </div>
  <Route {currentRoute} {params}/>


</div>