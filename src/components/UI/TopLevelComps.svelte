<script lang='ts'>
	import {maintenance} from '../../modules/global_stores/maintenance'
	import {navigation} from '../../modules/global_stores/navigation'
	//import {current_time} from '../../modules/global_stores/time_store'

	import Css from './Css.svelte'
	
	import ScrollTop from './ScrollTop.svelte'
	import { NotificationDisplay } from '../index'

	let n
</script>

<Css/>

{#if $maintenance}
	server is going down for sheduled maintenance
{/if}

{#if $navigation}
	{navigation}
{/if}

<NotificationDisplay bind:this={n} />

<ScrollTop/>
