<script lang='ts'>
  import { Route } from "../../components/svelte-router-spa/src/index.ts";
  	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e, form_type } from '../../modules/functions.ts'
  	import * as R from 'ramda'
  	import TreeSidebar from '../../components/TreeSidebar.svelte'
  	import {organization_id, organization_data} from '../../modules/global_stores/organization.ts'
  	import UrlPattern from 'url-pattern'

    export let currentRoute;
    export let params

    $organization_id = currentRoute.namedParams.org

    let mounted = false
	let er = ''
	let binded = false
	let fetch_data = false
	let org_fetch_evt = [et.get, e.admin, e.organization_list, 'org_fetch' ]
	let menu_evt = [et.get, e.my, e.form_schema_get, 'side_org_menu' ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_evt]); $organization_id = "" })
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	class Menu {
  		public menu = []
  	}
  	const m = new Menu;
  	function funcBindingOnce() {
	    if (!binded) {
	      S.bind$(org_fetch_evt, (d) => {
	      	$organization_data = d[0].r.result[0]
	      	fetch_data = true
	      }, 1)
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		if(d[0][0]){
	      			m.menu = d[0][0].organization
	      			menus = processMenu(R.clone(m.menu), $organization_id)
	      		}
	      	}
	      }, 1)
	      binded = true
          const args = [
		      [null, `="${$organization_id}"`],
		      [],
		      [0, 0, 1],
		      {type: form_type.object},
		    ]
          S.trigger([
          	[org_fetch_evt, args],
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

  	// when organization_id change or organization_data is change just refresh the component.

  	$: {menus = processMenu(R.clone(m.menu), $organization_id) }
</script>

<h4>Selected Organization: {$organization_id}</h4>
<div style="display: flex">
  <div>
	<TreeSidebar menu={menus}/>
  </div>
  {#if fetch_data}
  	<Route {currentRoute} {params}/>
  {/if}

</div>