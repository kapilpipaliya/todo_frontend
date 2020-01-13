import { writable,S } from '../functions'
import {event_type as et, events as e } from '../events'

export const maintenance = writable(false)

S.bind$( [et.get, e.account, e.maintenance_event, 0],
	function(data) {
	  // "server is going down for sheduled maintenance"
	  maintenance.set(data)
	},
	1
)
