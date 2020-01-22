<script lang='ts'>
  import { Route } from "../../components/svelte-router-spa/src/index.ts";
  	import { onMount, onDestroy, setContext, getContext,
  		S, ws_connected, event_type as et,events as e, form_type, Unique } from '../../modules/functions.ts'
  	import * as R from 'ramda'
  	import TreeSidebar from '../../components/TreeSidebar.svelte'
  	import {project_id, project_data} from '../../modules/global_stores/project.ts'
  	import UrlPattern from 'url-pattern'
  	import Skeleton from '../../components/Skeleton.svelte'

    export let currentRoute;
    export let params

    $project_id.push(currentRoute.namedParams.org)
    $project_id = $project_id

    let mounted = false
	let er = ''
	let binded = false
	let fetch_data = false
	let org_fetch_evt = [et.get, e.admin, e.organization_list, Unique.id]
	let menu_evt = [et.get, e.my, e.form_schema_get, Unique.id ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {
  		S.unbind_([menu_evt]); 
  		$project_id.pop(); 
  		$project_data.pop(); 
  		$project_id = $project_id, 
  		$project_data = $project_data
  		// be very careful: top level component unmount first.
  		// console.warn('organization unmount')
  	})
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	class Menu {
  		public menu = []
  	}
  	const m = new Menu;
  	function funcBindingOnce() {
	    if (!binded) {
	      S.bind$(org_fetch_evt, (d) => {
	      	if(d[0].r.result.length == 0) {
	      		console.log('no organization found')
	      	} else if(d[0].r.result[0]) {
	      		$project_data.push(d[0].r.result[0])
	      		$project_data = $project_data
	      		fetch_data = true
	      		return
	      	}
	      	console.log("cant set organization data")
	      }, 1)
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		if(d[0][0]){
	      			m.menu = d[0][0].organization
	      			menus = processMenu(R.clone(m.menu), $project_id[0])
	      			return
	      		}
	      	console.log("cant set menu")
	      	}
	      }, 1)
	      binded = true
          const args = [
		      [null, `="${$project_id[0]}"`],
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

  	// when project_id change or project_data is change just refresh the component.

  	$: {menus = processMenu(R.clone(m.menu), $project_id[0]) }
</script>

<h4>Selected Organization: {$project_id[0]}</h4>
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