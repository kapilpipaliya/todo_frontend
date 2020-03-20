// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { S } from './ws_events_dispatcher'
import { ET, E, form_schema_evt } from './enums'
import { isString, isObject } from 'ramda-adjunct'

export const translation = writable({})
export const fetchTranslations = async () => {
  const trans = await new Promise((resolve, reject) =>
    S.bindT(
      form_schema_evt(S.uid),
      (d: [[{}]]) => {
        resolve(d[0])
      },
      ['translation']
    )
  )
  translation.set(trans)
  return trans
}
// Todo Make Live Translations work
fetchTranslations()
/*S.bind$( [ET.get, e.translation_event, 0],
	function(data) {
	  console.log(data)
	},
	1
)*/
export function i18n(name: string | {}, lang = 'en') {
  if (isString(name)) {
    return name
  } else if (isObject(name)) {
    return name[lang]
  }
  return 'i18n Error'
}
