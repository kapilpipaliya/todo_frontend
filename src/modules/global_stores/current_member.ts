// use function directly on ws_dispatcher..
import { writable,S, level_of_member } from '../functions'
import {event_type as et, events as e } from '../events'

export const current_member = writable({})

S.bind$( [et.get, e.my, e.current_member, 0],
	function(data) {
		console.log(data)
		current_member.set(data)
	  
	},
	1
)
