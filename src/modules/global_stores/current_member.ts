// use function directly on ws_dispatcher..
import { writable, S } from '../index'
import { ET, E } from '../events'
export const current_member = writable({})
S.bind$( [ET.get, E.current_member_event, 0], function(data: [[]]) {current_member.set(data) }, 1 )