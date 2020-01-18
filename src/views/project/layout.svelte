<script lang='ts'>
  import { Route } from "../../components/svelte-router-spa/src/index.ts";
  	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e, form_type, Unique } from '../../modules/functions.ts'
  	import * as R from 'ramda'
  	import TreeSidebar from '../../components/TreeSidebar.svelte'
  	import {organization_id, organization_data} from '../../modules/global_stores/organization.ts'
  	import UrlPattern from 'url-pattern'
  	 import Skeleton from '../../components/Skeleton.svelte'

    export let currentRoute;
    export let params

    $organization_id.push(currentRoute.namedParams.project)
    $organization_id = $organization_id

    let mounted = false
	let er = ''
	let binded = false
	let fetch_data = false
	let project_fetch_evt = [et.get, e.admin, e.project_list, Unique.id ]
	let menu_evt = [et.get, e.my, e.form_schema_get, Unique.id ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_evt]); 
  		$organization_id.pop(); 
  		$organization_data.pop(); 
  		$organization_id = $organization_id, 
  		$organization_data = $organization_data
  		// be very careful: top level component unmount first.
  		// console.warn('project unmount')
  	})
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	class Menu {
  		public menu = []
  	}
  	const m = new Menu;
  	function funcBindingOnce() {
	    if (!binded) {
	      S.bind$(project_fetch_evt, (d) => {
	      	if(d[0].r.result.length == 0) {
	      		console.log('no project found')
	      	} else if(d[0].r.result[0]) {
	      		$organization_data.push(d[0].r.result[0])
	      		$organization_data = $organization_data
	      		fetch_data = true
	      		return
	      	}
	      	console.log("cant set organization data")
	      }, 1)
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		if(d[0][0]){
	      			m.menu = d[0][0].project
	      			menus = processMenu(R.clone(m.menu), $organization_id[0], $organization_id[1])
	      			return
	      		}
	      		console.log("cant set menu")
	      	}
	      }, 1)
	      binded = true
          const args = [
		      [null, null, `="${$organization_id[1]}"`], // project_id
		      [],
		      [0, 0, 1],
		      {type: form_type.object},
		    ]
          S.trigger([
          	[project_fetch_evt, args],
	    	[menu_evt, ['side_menu']],
	    	]) 
	    }
  	}
  	function processMenu(menu_, org, project) {
		for(let x of menu_) {
			x.path = new UrlPattern(x.path).stringify({org, project})
			if(x.children){
				x.children = processMenu(x.children, org, project)
			}
		}
		return menu_
  	}

  	// when organization_id change or organization_data is change just refresh the component.

  	$: {menus = processMenu(R.clone(m.menu), $organization_id[0], $organization_id[1]) }
</script>

<h4>Selected Project: {$organization_id[1]}</h4>
<div style="display: flex">
  <div>
	<TreeSidebar menu={menus}/>
  </div>
  {#if fetch_data}
  	<Route {currentRoute} {params}/>
  {:else}
  	<Skeleton/>
  {/if}

</div>