<script lang='ts'>
	import {translation} from './modules/global_stores/translation'
	import cookie from './modules/ws_events/cookie'
	import {member_settings} from './modules/global_stores/member_settings'
	import TopLevelComps from './components/UI/TopLevelComps.svelte'
	import Nav from './Nav.svelte'
	import Router from './Router.svelte'
</script>
<TopLevelComps/>
<Nav/>
<Router/>
