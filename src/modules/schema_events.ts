import {event_type as et, events as e, Unique} from './events'
// generate event from schema:
export const schemaEvents = (id: number | string = 0, schema: string) => {
  const h = e[`${schema}_list`]
  let e0 = 0
  if(h > 20 && h < 60){
    e0 = e.e_global
  } else if (h > 60 && h < 80) {
    e0 = e.account
  } else if (h > 80 && h < 140) {
    e0 = e.admin
  } else if (h > 140 && h < 160) {
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