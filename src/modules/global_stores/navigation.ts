// use function directly on ws_dispatcher..
import { Writable, writable,S } from '../functions'
import {event_type as et, events as e } from '../events'
import { navigateTo } from '../../components/svelte-router-spa/src/index.js'

// when logout every pages should be redirect to login page.
export const navigation = writable({})

// must use id =0
S.bind$( [et.get, e.account, e.redirection_event, 0],
	function(data) {
	  //goto(data[0])
	  navigateTo(data[0][0])
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