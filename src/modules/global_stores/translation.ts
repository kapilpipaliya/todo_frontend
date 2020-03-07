// use function directly on ws_dispatcher..
import { writable, S } from '../index'
import { ET, E, form_schema_evt } from '../events'
export const translation = writable({})
export const fetchTranslations = async () => {
  const trans = await new Promise((resolve, reject) => S.bindT(form_schema_evt(S.uid), (d: [[{}]]) => {resolve(d[0]) }, ['translation'] ) )
  translation.set(trans)
  return trans
}
fetchTranslations()
/*S.bind$( [ET.get, E.account, e.translation_event, 0],
	function(data) {
	  console.log(data)
	},
	1
)*/
