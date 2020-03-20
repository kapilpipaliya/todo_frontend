import { writable } from 'svelte/store'
import { ET, E } from './events'
import { S } from './ws_events_dispatcher'
export const maintenance = writable(false)
// "server is going down for sheduled maintenance"
S.bind$(
  [ET.get, E.maintenance_event, 0],
  function(data: boolean) {
    maintenance.set(data)
  },
  1
)
