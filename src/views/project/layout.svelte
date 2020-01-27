<script lang='ts'>
  import { Route } from "../../components/svelte-router-spa/src/index.ts";
  	import { onMount, onDestroy, writable, setContext, getContext, get,
  		S, ws_connected, event_type as et,events as e, form_type, Unique } from '../../modules/index.ts'
  	import * as R from 'ramda'
  	import TreeSidebar from '../../components/TreeSidebar.svelte'

  	import UrlPattern from 'url-pattern'
  	 import Skeleton from '../../components/Skeleton.svelte'

    export let currentRoute;
    export let params

    const project_id = currentRoute.namedParams.project
    const project_id_ctx = writable(project_id);
    const project_data_ctx = writable({});
    setContext('project_id', project_id_ctx);
    setContext("project_data", project_data_ctx)
    const org_id = getContext('org_id')

    let mounted = false
	let er = ''
	let binded = false
	let fetch_data = false
	let project_fetch_evt = [et.get, e.admin, e.project_list, Unique.id ]
	let menu_evt = [et.get, e.my, e.form_schema_get, Unique.id ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_evt]); 
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
	      	const result = d[0][1].r.result
	      	if(result.length == 0) {
	      		console.log('no project found')
	      	} else if(result[0]) {
	      		const project_data = result[0]
	      		project_data_ctx.set(project_data)
	      		fetch_data = true
	      		return
	      	}
	      	console.log("cant set project data")
	      }, 1)
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		if(d[0][0]){
	      			m.menu = d[0][0].project
	      			menus = processMenu(R.clone(m.menu), org_id, project_id)
	      			return
	      		}
	      		console.log("cant set menu")
	      	}
	      }, 1)
	      binded = true
          const args = [
		      [null, null, `="${project_id}"`], // project_id
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

  	// when project_id change or project_data is change just refresh the component.

  	$: {menus = processMenu(R.clone(m.menu), org_id, project_id) }
</script>

<h4>Selected Project: {project_id}</h4>
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