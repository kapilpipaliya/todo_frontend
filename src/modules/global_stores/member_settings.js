// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { S } from '../functions.ts'
import {event_type as et, events as e } from '../events.ts'

// when logout every pages should be redirect to login page.
export const member_settings = new writable()



	S.bind$(e.cookie_event, (d) => {
    
  }, 1)

