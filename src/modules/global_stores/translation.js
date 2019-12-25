// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { S, form_schema_evt } from '../functions.js'
import {event_type as et, events as e } from '../events.js'

export const translation = new writable({})

export const fetchTranslations = async () => {
  const trans = await new Promise((resolve, reject) => {
    S.bind_(
      form_schema_evt('glob_tran'),
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
