import {event_type as et, events as e, Unique} from './events'

export const isLoggedIn = async S => await new Promise((resolve, reject) => {S.bindT([et.get, e.account, e.is_logged_in, Unique.id], (d: [[]]) => {resolve(d) }, [[]] ) })