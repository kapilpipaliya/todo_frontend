import { isString, isObject } from 'ramda-adjunct'
export function i18n(name: string | {}, lang = 'en'){
  if (isString(name)) {
    return name
  } else if(isObject(name)) {
    return name[lang]
  }
  return "i18n Error"
}
