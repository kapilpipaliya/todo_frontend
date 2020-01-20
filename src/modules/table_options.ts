
import {event_type as et, events as e, Unique} from './events'
// the component cant include this file because of cyclic depandancy
import GeneralForm from '../components/form/Index.svelte'

export const tableOptions = {
}

export const getTableOptions =  (query) => { 
  const schema_key = query.page ?? query.table ?? query
  const o = tableOptions[schema_key];
  if (o) {
    o.table.query = query
    return o
  } else {
    return {
      title: 'genaric',
      table: {
        customFilter: {},
        modelcomponent: GeneralForm,
        quickcomponent: GeneralForm,
        schema_key,
        query
      }
    }
  }
}