import {event_type as et, events as e, Unique} from './events'
// generate event from schema:
export const schemaEvents = (id: number | string = 0, schema: string) => {
  const h = e[`${schema}_list`]
  let e0 = 0
  if(h > 49 && h < 100){
    e0 = e.e_global
  } else if (h > 100 && h < 200) {
    e0 = e.account
  } else if (h > 200 && h < 300) {
    e0 = e.admin
  } else if (h > 300 && h < 400) {
    e0 = e.my
  }
  if(h){
    return [
        [et.subscribe, e0, e[`${schema}_list`], id],
        [et.mutate, e0, e[`${schema}_mutate`], id],
      ]
  } else if(schema == 'register'){
    return [
        null,
        [et.mutate, e.account, e.register_user, Unique.id],
      ]
  } else if(schema == 'login'){
  	return [
      null,
      [et.mutate, e.account, e.login, Unique.id],
    ]
  }
}