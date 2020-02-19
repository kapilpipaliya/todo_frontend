<script lang='ts'>
	// initialize stores:
	import {translation} from './modules/global_stores/translation'
	import {cookie} from './modules/global_stores/cookie'
	import {member_settings} from './modules/global_stores/member_settings'
	
	import TopLevelComps from './components/UI/TopLevelComps.svelte'
	import Nav from './Nav.svelte'

	import Router from './Router.svelte'
</script>

<TopLevelComps/>
<Nav/>
<Router/>
