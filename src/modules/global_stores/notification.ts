// use function directly on ws_dispatcher..
import { Writable, writable,S } from '../functions'
import {event_type as et, events as e } from '../events'

export const notification = writable({})

S.bind$(e.notification_event, (d) => {
    
  }, 1)

