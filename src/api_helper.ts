import {ET, E} from './events'
export const isLoggedIn = async S => await new Promise((resolve, reject) => {S.bindT([ET.get, E.is_logged_in, S.uid], (d: [[]]) => {resolve(d) }, [[]] ) })