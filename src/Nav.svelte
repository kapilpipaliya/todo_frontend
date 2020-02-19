<script lang='ts'>
	import {current_member} from './modules/global_stores/current_member'
	declare let $current_member

	import MenuF from './components/UI/MenuF.svelte'

	import { onMount, onDestroy, S, ws_connected, event_type as et,events as e, Unique } from './modules/index'
	declare let $ws_connected

	let mounted = false
	let er = ''
	let binded = false

	const menu_evt = [et.get, e.my, e.form_schema_get, Unique.id ]
	let menus  = []
	onMount(() => {mounted = true})
  	onDestroy(() => {S.unbind_([menu_evt]) })
  	$: if (mounted) {if ($ws_connected) {er = ''; funcBindingOnce() } else {er = 'Reconnecting...'} }
  	function funcBindingOnce() {
	    if (!binded) {
	      S.bind$(menu_evt, (d) => {
	      	if(d[0].length && d[0][0]){
	      		menus = d[0][0]
	      	}
	      }, 1)
	      binded = true
          S.trigger([ [menu_evt, ['menu']] ]) 
	    }
  	}

	let email
	$: email = $current_member?.email;
</script>

<nav>
	{#if email}
		Current User: {email}
	{/if}

	{#if menus.navData}
		<MenuF menu={menus.navData.account}/>
	{/if}

	{#if menus.navData}
		<MenuF menu={menus.navData.global}/>
	{/if}

	{#if menus.navData}
		<MenuF menu={menus.navData.admin}/>
	{/if}
</nav>
