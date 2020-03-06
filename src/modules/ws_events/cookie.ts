// use function directly on ws_dispatcher..
import { S } from '../index'
import { event_type as et, events as e } from '../events'
// read more: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
function saveCookie(name:string, value:string, max_age:number) {document.cookie = `${name}=${value}; path=/; max-age=${max_age}` }
function clearCookie(d) {document.cookie = `time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/` }
// must use id =0
S.bind$([et.get, e.account, e.cookie_event, 0], saveCookies, 1 )
function saveCookies(data){Object.keys(data.cookie).forEach(key=>{saveCookie(key, data.cookie[key], data.max_age) }); }
export default null