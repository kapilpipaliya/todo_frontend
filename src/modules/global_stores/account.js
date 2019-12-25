// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { S } from '../functions.js'
import {event_type as et, events as e } from '../events.js'

// when logout every pages should be redirect to login page.
export const account = new writable()


	S.bind$(e.cookie_event, (d) => {
    
  }, 1)

