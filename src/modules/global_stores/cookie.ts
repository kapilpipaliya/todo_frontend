// use function directly on ws_dispatcher..

import { Writable, writable,S} from '../functions'
import {event_type as et, events as e} from '../events'

export const cookie = writable({})



function saveCookie(name, value, max_age) {
	// read more: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
	document.cookie = `${name}=${value}; path=/; max-age=${max_age}`
}
function clearCookie(d) {
  document.cookie = `time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

// must use id =0
S.bind$([et.get, e.account, e.cookie_event, 0],
  function(data) {
  	Object.keys(data[0].cookie).forEach(key=>{
	   saveCookie(key, data[0].cookie[key], data[0].max_age)
	});
  },
  1
)
