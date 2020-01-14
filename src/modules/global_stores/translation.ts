// use function directly on ws_dispatcher..
import { Writable, writable,S, form_schema_evt, Unique } from '../functions'
import {event_type as et, events as e } from '../events'

export const translation = writable({})

export const fetchTranslations = async () => {
  const trans = await new Promise((resolve, reject) => {
    S.bind_(
      form_schema_evt(Unique.id),
      ([d]) => {
        resolve(d[0])
      },
      ['translation']
    )
  })
  translation.set(trans)
  return trans
}

fetchTranslations()


/*S.bind$( [et.get, e.account, e.translation_event, 0],
	function(data) {
	  console.log(data)
	},
	1
)*/
