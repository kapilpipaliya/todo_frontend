<script lang='ts'>
  import { Route } from "../../components/svelte-router-spa/src/index.ts";
  	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e, form_type } from '../../modules/functions.ts'
  	import * as R from 'ramda'
  	import TreeSidebar from '../../components/TreeSidebar.svelte'
  	import {organization_id, organization_data} from '../../modules/global_stores/organization.ts'
  	import {project_id, project_data} from '../../modules/global_stores/project.ts'
  	import UrlPattern from 'url-pattern'

    export let currentRoute;
    export let params

    // $organization_id = currentRoute.namedParams.org
    $project_id = currentRoute.namedParams.project

    let mounted = false
	let er = ''
	let binded = false
	let fetch_data = false
	let project_fetch_evt = [et.get, e.admin, e.project_list, 'project_fetch' ]
	let menu_evt = [et.get, e.my, e.form_schema_get, 'side_pro_menu' ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_evt]); $project_id = ""; $project_data = {} })
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
	      	}
	      	$project_data = d[0].r.result[0]
	      	fetch_data = true
	      }, 1)
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		if(d[0][0]){
	      			m.menu = d[0][0].project
	      			menus = processMenu(R.clone(m.menu), $organization_id, $project_id)
	      		}
	      	}
	      }, 1)
	      binded = true
          const args = [
		      [null, null, `="${$project_id}"`],
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

  	$: {menus = processMenu(R.clone(m.menu), $organization_id, $project_id) }
</script>

<h4>Selected Project: {$project_id}</h4>
<div style="display: flex">
  <div>
	<TreeSidebar menu={menus}/>
  </div>
  {#if fetch_data}
  	<Route {currentRoute} {params}/>
  {/if}

</div>