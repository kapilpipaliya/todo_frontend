<script lant='ts'>
	import { writable, S, event_type as et,events as e } from '../../modules/index'
	import { navigateTo } from '../svelte-router-spa/src/index'
	const navigation = writable("")
	// must use id =0
	S.bind$( [et.get, e.account, e.redirection_event, 0],
		function(data) {
		  if(data[0][1]) {
		  	navigation.set(data[0][2])
		  	setTimeout(function(){navigateTo(data[0][0]) }, data[0][1]);
		  } else {
		  	navigateTo(data[0][0])
		  }
		},
		1
	)

	/*export function goBackOrNavigate(path) {
	  if (window.history.length === 1) {
	    goto('/admin/users')
	  } else {
	    window.history.back()
	  }
	}*/
</script>

{#if $navigation}
	{navigation}
{/if}