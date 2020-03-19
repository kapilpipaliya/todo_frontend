<script lang="ts">
  import { writable } from 'svelte/store'
  import { S } from '../../ws_events_dispatcher'
  import { ET, E } from '../../events'
  import { navigateTo } from '../svelte-router-spa/src/index'
  const navigation = writable('')
  // must use id =0
  S.bind$(
    [ET.get, E.redirection_event, 0],
    function(data) {
      if (data[1]) {
        navigation.set(data[2])
        setTimeout(function() {
          navigateTo(data[0])
        }, data[1])
      } else {
        navigateTo(data[0])
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

{#if $navigation}{navigation}{/if}
