// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { S } from '../functions.js'
import {event_type, events} from '../events.js'

export const notification = new writable()

notification.subscribe(value => {
  console.log(value)
})


	S.bind$(events.notification_event, (d) => {
    
  }, 1)

