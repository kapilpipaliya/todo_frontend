
import {event_type as et, events as e} from './events'
// the component cant include this file because of cyclic depandancy
import GeneralForm from '../components/form/Index.svelte'

/* process events from database:
//import * as R from 'ramda'
//sample
export const schemaEvents = (id=0) => {
  const ev = [
      [et.subscribe, e.e_global, e.schema_header],
      [et.subscribe, e.e_global, e.schema_list],
      [et.mutate, e.e_global, e.schema_mutate],
    ]
  return  R.map(x=>{x.push(id); return x}, ev)
}
const processEvent = (id, evt) => {
  evt[0] = et[evt[0]]
  evt[1] = e[evt[1]]
  evt[2] = e[evt[2]]
  evt.push(id)
  return evt
}
export const schemaEvents2 = (id=0, schema) => {
  return R.map(R.curry(processEvent)(id), schema)
}
*/
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
  return [
      [et.subscribe, e0, e[`${schema}_list`], id],
      [et.mutate, e0, e[`${schema}_mutate`], id],
    ]
}

export const tableOptions = {
}

export const getTableOptions =  (query) => { 
  const schema_key = query.page ?? query.table ?? query
  const o = tableOptions[schema_key];
  if (o) {
    o.table.query = query
    return o
  } else {
    // user, session, note, confirm, org, 
    return {
      title: 'genaric',
      table: {
        eventsFn: schemaEvents,
        customFilter: {},
        modelcomponent: GeneralForm,
        quickcomponent: GeneralForm,
        schema_key,
        query
      }
    }
  }
}