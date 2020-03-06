<script lang='ts'>
	import {current_member} from './modules/global_stores/current_member'
	declare let $current_member
	import MenuF from './components/UI/MenuF.svelte'
	import { onDestroy, S, event_type as et,events as e, Unique } from './modules/index'
	let menus  = []
  onDestroy(S.bindT([et.get, e.my, e.form_schema_get, Unique.id ], (d) => {if(d[0]){menus = d[0] } }, ['menu'], 1))
	let email
	$: email = $current_member?.email;
</script>
<nav>
	{#if email} Current User: {email} {/if}
	{#if menus.navData} <MenuF menu={menus.navData.account}/> {/if}
	{#if menus.navData} <MenuF menu={menus.navData.global}/> {/if}
	{#if menus.navData} <MenuF menu={menus.navData.admin}/> {/if}
</nav>