import { writable,S } from '../index'
import { event_type as et, events as e } from '../events'
export const maintenance = writable(false)
// "server is going down for sheduled maintenance"
S.bind$( [et.get, e.account, e.maintenance_event, 0], function(data: boolean) {maintenance.set(data) }, 1 )