
import {event_type as et, events as e} from './events.js'
import * as R from 'ramda'
// the component cant include this file because of cyclic depandancy
import SchemaForm from '../global/SchemaForm.svelte'
import TranslationForm from '../global/TranslationForm.svelte'
import GeneralForm from '../components/form/Index.svelte'

// global events
// fix this functions to accept arguments, based on it return get or subscription
// save all this config on server, ramda will help
export const schemaEvents = (id=0) => {
  const ev = [
      [et.subscribe, e.e_global, e.global_schema_header],
      [et.subscribe, e.e_global, e.global_schema_list],
      [et.mutate, e.e_global, e.global_schema_mutate],
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


export const userEvents = (id=0) => {
  const ev = [
        [et.subscribe, e.e_global, e.global_user_header],
        [et.subscribe, e.e_global, e.global_user_list],
        [et.mutate, e.e_global, e.global_user_mutate],
      ]
      return  R.map(x=>{x.push(id); return x}, ev)
}
export const translationEvents = (id=0) => {
  const ev = [
        [et.subscribe, e.e_global, e.global_translation_header],
        [et.subscribe, e.e_global, e.global_translation_list],
        [et.mutate, e.e_global, e.global_translation_mutate],
      ]
      return  R.map(x=>{x.push(id); return x}, ev)
}
export const sessionEvents = (id=0) => {
  const ev = [
        [et.subscribe, e.e_global, e.global_session_header],
        [et.subscribe, e.e_global, e.global_session_list],
        [et.mutate, e.e_global, e.global_session_mutate],
      ]
      return  R.map(x=>{x.push(id); return x}, ev)
}
export const confirmEvents = (id=0) => {
  const ev = [
        [et.subscribe, e.e_global, e.global_confirm_header],
        [et.subscribe, e.e_global, e.global_confirm_list],
        [et.mutate, e.e_global, e.global_confirm_mutate],
      ]
      return  R.map(x=>{x.push(id); return x}, ev)
}
export const noteEvents = (id=0) => {
  const ev = [
        [et.subscribe, e.e_global, e.global_note_header],
        [et.subscribe, e.e_global, e.global_note_list],
        [et.mutate, e.e_global, e.global_note_mutate],
      ]
      return  R.map(x=>{x.push(id); return x}, ev)
}
export const orgEvents = (id=0) => {
  const ev = [
      [et.subscribe, e.admin, e.admin_org_header],
      [et.subscribe, e.admin, e.admin_org_list],
      [et.mutate, e.admin, e.admin_org_mutate],
    ]
    return  R.map(x=>{x.push(id); return x}, ev)
}

export const tableOptions = {
  user: {
    title: 'user_title',
    table: {
      eventsFn: userEvents,
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'user',
    }
  },
  schema: {
    title: 'schema_title',
    table: {
      eventsFn: schemaEvents,
      customFilter: {},
      modelcomponent: SchemaForm,
      quickcomponent: SchemaForm,
      schema_key: 'schema'
      // object form
    }
  },
  translation: {
    title: 'translation_title',
    table: {
      eventsFn: translationEvents,
      customFilter: {},
      modelcomponent: TranslationForm,
      quickcomponent: TranslationForm,
      schema_key: 'translation'
      // object form
    }
  },
  session: {
    title: 'session_title',
    table: {
      eventsFn: sessionEvents,
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'session',
    }
  },
  confirm: {
    title: 'confirm_title',
    table: {
      eventsFn: confirmEvents,
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'confirm',
    }
  },
    note: {
    title: 'note_title',
    table: {
      eventsFn: noteEvents,
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'note'
    }
  },
  org: {
    title: 'org_title',
    table: {
      eventsFn: orgEvents,
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'org',
    }
  }
}

export const getTableOptions =  (query) => { 
  const o = tableOptions[query.page || query.table || query];
  if (o) {
    o.table.query = query
    return o
  }
  return {}
}