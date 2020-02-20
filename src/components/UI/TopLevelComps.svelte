<script lang='ts'>
	import {maintenance} from '../../modules/global_stores/maintenance'

	//import {current_time} from '../../modules/global_stores/time_store'

	import Css from './Css.svelte'
	import Navigate from './Navigate.svelte'
	
	import ScrollTop from './ScrollTop.svelte'
	import { NotificationDisplay } from '../thirdparty/svelte-notifications/src/index'

	let n
</script>

<Css/>

{#if $maintenance}
	server is going down for sheduled maintenance
{/if}

<Navigate/>

<NotificationDisplay bind:this={n} />

<ScrollTop/>
