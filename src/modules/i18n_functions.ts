import * as RA from 'ramda-adjunct'
export function i18n(name: string | {}, lang = 'en'){
  if (RA.isString(name)) {
    return name
  } else if(RA.isObject(name)) {
    return name[lang]
  }
  return "i18n Error"
}
