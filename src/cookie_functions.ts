import StorageDB from './storage'
/*
import cookie from 'cookie'
export const setCookie  = res => {
    res.setHeader('Set-Cookie', cookie.serialize('name', "Dobo", {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
    }));
}*/
//https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
export function getCookieValue(a) {
  var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)')
  return b ? b.pop() : ''
}
export const getSettingCache = async key => {
  const db = new StorageDB('setting', 1)
  const setting = await db.getItem(key)
  return setting
}

// read more: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
export function saveCookie(name: string, value: string, max_age: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${max_age}`
}
export function clearCookie(d) {
  document.cookie = `time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}