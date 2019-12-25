// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { S } from '../functions.js'
import {event_type as et, events as e} from '../events.js'

export const cookie = new writable()



function saveCookie(name, value, max_age) {
	// read more: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
	document.cookie = `${name}=${value}; path=/; max-age=${max_age}`
}

  S.bind$(
    [et.get, e.account, e.cookie_event, 0],
    function(data) {
    	Object.keys(data[0].cookie).forEach(key=>{
		   saveCookie(key, data[0].cookie[key], data[0].max_age)
		});
    },
    1
  )
