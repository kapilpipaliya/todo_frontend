<script lang="ts">
  import { writable } from 'svelte/store';
  import { Ws } from '../../ws_events_dispatcher';
  import { ET, E } from '../../enums';
  import { navigateTo } from '../../utils/svelte-router-spa/index';
  const navigation = writable('');
  // must use id =0
  Ws.bind$(
    [ET.get, E.redirection_event, 0],
    function(data) {
      if (data[1]) {
        navigation.set(data[2]);
        setTimeout(function() {
          navigateTo(data[0]);
        }, data[1]);
      } else {
        navigateTo(data[0]);
      }
    },
    1
  );
  /*export function goBackOrNavigate(path) {
	  if (window.history.length === 1) {
	    goto('/admin/users')
	  } else {
	    window.history.back()
	  }
	}*/
</script>

{#if $navigation}{navigation}{/if}
