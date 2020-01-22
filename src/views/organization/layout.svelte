<script lang='ts'>
  import { Route } from "../../components/svelte-router-spa/src/index.ts";
  	import { onMount, onDestroy, setContext, getContext,
  		S, ws_connected, event_type as et,events as e, form_type, Unique } from '../../modules/functions.ts'
  	import * as R from 'ramda'
  	import TreeSidebar from '../../components/TreeSidebar.svelte'

  	import UrlPattern from 'url-pattern'
  	import Skeleton from '../../components/Skeleton.svelte'

    export let currentRoute;
    export let params

    const org_id = currentRoute.namedParams.org
    setContext("org_id", org_id)

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
	      	const result = d[0][1].r.result
	      	if(result.length == 0) {
	      		console.log('no organization found')
	      	} else if(result[0]) {
	      		const org_data = result[0]
	      		setContext("org_data", org_data)
	      		fetch_data = true
	      		return
	      	}
	      	console.log("cant set organization data")
	      }, 1)
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		if(d[0][0]){
	      			m.menu = d[0][0].organization
	      			menus = processMenu(R.clone(m.menu), org_id)
	      			return
	      		}
	      	console.log("cant set menu")
	      	}
	      }, 1)
	      binded = true
          const args = [
		      [null, `="${org_id}"`],
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

  	$: {menus = processMenu(R.clone(m.menu), org_id) }
</script>

<h4>Selected Organization: {org_id}</h4>
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