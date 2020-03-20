// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { ET, E } from './events'
import { S } from './ws_events_dispatcher'
// when logout every pages should be redirect to login page.
export const member_settings = writable({})
//Todo Fix this
/*
S.bind$(e.cookie_event, (d) => {
    
}, 1)
*/
