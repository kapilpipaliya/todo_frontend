<script lang='ts'>
  import { Route } from "../../components/svelte-router-spa/src/index";
  	import { onMount, onDestroy, writable, setContext, getContext, get,
  		S, ws_connected, ET,E, ValueType } from '../../modules/index'
  	declare let $ws_connected
  	import { clone } from 'rambda'
  	import TreeSidebar from '../../components/UI/TreeSidebar.svelte'
  	import UrlPattern from 'url-pattern'
  	import Skeleton from '../../components/UI/Skeleton.svelte'
    export let currentRoute;
    const project_id = currentRoute.namedParams.project
    const project_id_ctx = writable(project_id);
    const project_data_ctx = writable({});
    declare let $project_data_ctx
    setContext('project_id', project_id_ctx);
    setContext("project_data", project_data_ctx)
    const org_id = getContext('org_id')
    declare let $org_id
    const project_ctx = getContext('project')
    declare let $project_ctx
    let mounted = false
	let er = ''
	let binded = false
	let fetch_data = false
	let project_fetch_evt = [ET.get, E.admin, E.project_list, S.uid ]
	let menu_evt = [ET.get, E.my, E.form_schema_get, S.uid ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_evt]); 
  		// be very careful: top level component unmount first.
  		// console.warn('project unmount')
  		$project_ctx.pop()
  	})
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	class Menu {public menu = [] }
  	const m = new Menu;
  	function funcBindingOnce() {
	    if (!binded) {
	      S.bind$(project_fetch_evt, (d) => {
	      	const result = d[1].r.result
	      	if(result.length == 0) {
	      		console.warn('no project found')
	      	} else if(result[0]) {
	      		const project_data = result[0]
	      		$project_data_ctx = project_data
	      		$project_ctx.push(project_data)
	      		fetch_data = true
	      		return
	      	}
	      	console.warn("cant set project data")
	      }, 1)
	      S.bind$(menu_evt, (d) => {
	      	if(d[0]){
	      		if(d[0]){
	      			m.menu = d[0].project
	      			menus = processMenu(clone(m.menu), $org_id, project_id)
	      			return
	      		}
	      		console.warn("cant set menu")
	      	}
	      }, 1)
	      binded = true
          const args = [
		      [null, `="${project_id}"`], // project_id
		      [],
		      [0, 0, 1],
		      {type: ValueType.Object, org: $project_ctx?.[$project_ctx.length - 1]?._key ?? null },
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
  	// enable this when need:
  	//$: {menus = processMenu(clone(m.menu), $org_id, project_id) }
</script>
PROJECT LAYOUT
<h4>Selected Project: {project_id}</h4>
<div style="display: flex">
  <div>
	<TreeSidebar menu={menus}/>
  </div>
  {#if fetch_data}
  	<Route {currentRoute} />
  {:else}
  	<Skeleton/>
  {/if}
</div>