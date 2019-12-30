// use function directly on ws_dispatcher..
import { Writable, writable, S } from '../functions'
import {event_type as et, events as e } from '../events'

// when logout every pages should be redirect to login page.
export const account = writable({})


	S.bind$(e.cookie_event, (d) => {
    
  }, 1)

