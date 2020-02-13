// use function directly on ws_dispatcher..
import { writable, S } from '../index'
import { event_type as et, events as e } from '../events'

export const current_member = writable({})

S.bind$( [et.get, e.account, e.current_member_event, 0],
	function([data]: [[]]) {
		current_member.set(data)
	  
	},
	1
)
