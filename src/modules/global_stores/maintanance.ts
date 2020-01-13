import { writable,S } from '../functions'
import {event_type as et, events as e } from '../events'

export const maintanance = writable({})

S.bind$( [et.get, e.account, e.redirection_event, 0],
	function(data) {
	  // "server is going down for sheduled maintanance"
	  maintanance.set(data)
	},
	1
)
