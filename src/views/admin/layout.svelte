<script lang='ts'>
	import { Route } from "../../components/svelte-router-spa/src/index";
	import { onMount, onDestroy, S, ws_connected, ET,E } from '../../modules/index'
	declare let $ws_connected
	import TreeSidebar from '../../components/UI/TreeSidebar.svelte'
	import Skeleton from '../../components/UI/Skeleton.svelte'
	export let currentRoute;
  let mounted = false
	let er = ''
	let binded = false
	let fetch_data = false
	let menu_evt = [ET.get, E.my, E.form_schema_get, S.uid ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_evt]) })
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	function funcBindingOnce() {
	    if (!binded) {
	      S.bind$(menu_evt, (d) => {
	      	if(d[0]){
	      		menus = d[0]
	      		fetch_data = true // not important on menu
	      	}
	      }, 1)
	      binded = true
          S.trigger([
	    	[menu_evt, ['side_menu']],
	    	]) 
	    }
  	}
</script>
ADMIN LAYOUT
<div style="display: flex">
  <div>
    {#if menus.admin}
		<TreeSidebar menu={menus.admin}/>
	{/if}
  </div>
  {#if fetch_data}
  	<Route {currentRoute} />
  {:else}
  	<Skeleton/>
  {/if}
</div>