// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { ET, E } from './enums'
import { S } from './ws_events_dispatcher'

export const current_member = writable({})
S.bind$(
  [ET.get, E.current_member_event, 0],
  function (data: [[]]) {
    current_member.set(data)
  },
  1
)

// member_settings
// when logout every pages should be redirect to login page.
export const member_settings = writable({})
//Todo Fix this
