// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { S } from '../functions.js'
import {event_type, events} from '../events.js'

// when logout every pages should be redirect to login page.
export const member_settings = new writable()

member_settings.subscribe(value => {
  console.log(value)
})

if (process.browser) {
	S.bind$(events.cookie_event, (d) => {
    
  }, 1)

}