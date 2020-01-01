<script lang='ts'>
  import { Route } from "../../components/svelte-router-spa/src/index.ts";
  	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e } from '../../modules/functions.ts'
  	import * as R from 'ramda'
  	import TreeSidebar from '../../components/TreeSidebar.svelte'
  	import {organization} from '../../modules/global_stores/organization.ts'
  	import UrlPattern from 'url-pattern'

    export let currentRoute;
    export let params
    console.log(currentRoute.namedParams.org)
    $organization = currentRoute.namedParams.org

    let mounted = false
	let er = ''
	let binded = false
	let menu_evt = [et.get, e.my, e.form_schema_get, 'side_org_menu' ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_evt]) })
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	class Menu {
  		public menu = []
  	}
  	const m = new Menu;
  	function funcBindingOnce() {
	    if (!binded) {
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		if(d[0][0]){
	      			m.menu = d[0][0].organization
	      			menus = processMenu(R.clone(m.menu), $organization)
	      		}
	      	}
	      }, 1)
	      binded = true
          S.trigger([
	    	[menu_evt, ['side_menu']],
	    	]) 
	    }
  	}
  	function processMenu(menu_, org) {
		for(let x of menu_) {
			x.path = new UrlPattern(x.path).stringify({org})
			if(x.children){
				x.children = processMenu(x.children, org)
			}
		}
		return menu_
  	}
  	$: {menus = processMenu(R.clone(m.menu), $organization) }
</script>

<h4>Selected Organization: {$organization}</h4>
<div style="display: flex">
  <div>
	<TreeSidebar menu={menus}/>
  </div>
  <Route {currentRoute} {params}/>


</div>