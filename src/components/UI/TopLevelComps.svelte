<script lang='ts'>
	import {maintenance} from '../../maintenance'
	//import {current_time} from '../../time_store'
	import Css from './Css.svelte'
	import Navigate from './Navigate.svelte'
	import ScrollTop from './ScrollTop.svelte'

  import NightMode from './NightMode.svelte'
	let n
</script>
<Css/>
{#if $maintenance} server is going down for sheduled maintenance {/if}
<Navigate/>

<NightMode/>
<ScrollTop/>