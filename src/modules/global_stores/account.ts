// use function directly on ws_dispatcher..
import { writable, S } from '../index'
import { event_type as et, events as e } from '../events'

// when logout every pages should be redirect to login page.
export const account = writable({})


	S.bind$(e.cookie_event, (d) => {
    
  }, 1)

