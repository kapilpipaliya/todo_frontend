// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { S } from '../functions.ts'
import {event_type as et, events as e } from '../events.ts'

export const notification = new writable()



	S.bind$(e.notification_event, (d) => {
    
  }, 1)

