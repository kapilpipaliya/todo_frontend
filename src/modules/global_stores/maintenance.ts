import { writable,S } from '../index'
import { ET, E } from '../events'
export const maintenance = writable(false)
// "server is going down for sheduled maintenance"
S.bind$( [ET.get, E.maintenance_event, 0], function(data: boolean) {maintenance.set(data) }, 1 )