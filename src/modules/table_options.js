
import {event_type as et, events as e} from './events.js'
// the component cant include this file because of cyclic depandancy
import SchemaForm from '../global/_SchemaForm.svelte'
import TranslationForm from '../global/_TranslationForm.svelte'
import GeneralForm from '../_components/form/Index.svelte'

// global events
// fix this functions to accept arguments, based on it return get or subscription
// save all this config on server, ramda will help
export const schemaEvents = (id=0) => {
  return  [
      [et.subscribe, e.e_global, e.global_schema_header, id],
      [et.subscribe, e.e_global, e.global_schema_list, id],
      [et.unsubscribe, e.e_global, e.global_schema_list, id],
      [et.mutate, e.e_global, e.global_schema_mutate, id],
    ]
}
export const userEvents = (id=0) => {
  return  [
        [et.subscribe, e.e_global, e.global_user_header, id],
        [et.subscribe, e.e_global, e.global_user_list, id],
        [et.unsubscribe, e.e_global, e.global_user_list, id],
        [et.mutate, e.e_global, e.global_user_mutate, id],
      ]
}
export const translationEvents = (id=0) => {
  return  [
        [et.subscribe, e.e_global, e.global_translation_header, id],
        [et.subscribe, e.e_global, e.global_translation_list, id],
        [et.unsubscribe, e.e_global, e.global_translation_list, id],
        [et.mutate, e.e_global, e.global_translation_mutate, id],
      ]
}
export const sessionEvents = (id=0) => {
  return  [
        [et.subscribe, e.e_global, e.global_session_header, id],
        [et.subscribe, e.e_global, e.global_session_list, id],
        [et.unsubscribe, e.e_global, e.global_session_list, id],
        [et.mutate, e.e_global, e.global_session_mutate, id],
      ]
}
export const confirmEvents = (id=0) => {
  return  [
        [et.subscribe, e.e_global, e.global_confirm_header, id],
        [et.subscribe, e.e_global, e.global_confirm_list, id],
        [et.unsubscribe, e.e_global, e.global_confirm_list, id],
        [et.mutate, e.e_global, e.global_confirm_mutate, id],
      ]
}
export const noteEvents = (id=0) => {
  return  [
        [et.subscribe, e.e_global, e.global_note_header, id],
        [et.subscribe, e.e_global, e.global_note_list, id],
        [et.unsubscribe, e.e_global, e.global_note_list, id],
        [et.mutate, e.e_global, e.global_note_mutate, id],
      ]
}
export const orgEvents = (id=0) => {
  return [
      [et.subscribe, e.admin, e.admin_org_header, id],
      [et.subscribe, e.admin, e.admin_org_list, id],
      [et.unsubscribe, e.admin, e.admin_org_list, id],
      [et.mutate, e.admin, e.admin_org_mutate, id],
    ]
}

// when forms become dynamic you can add here too.
export const noteMutateEvents = (id=0) => {
    return [
      [et.get, e.e_global, e.global_note_list, id ],
      [et.subscribe, e.e_global, e.global_note_list, id ],
      [et.mutate, e.e_global, e.global_note_mutate, id],
      [et.unsubscribe, e.e_global, e.global_note_list, id],
    ]
}
export const orgMutateEvents = (id=0) => {
    return [
      [et.get, e.admin, e.admin_org_list, id ],
      [et.subscribe, e.admin, e.admin_org_list, id ],
      [et.mutate, e.admin, e.admin_org_mutate, id],
      [et.unsubscribe, e.admin, e.admin_org_list, id],
    ]
}

export const tableOptions = {
  user: {
    title: 'user_title',
    table: {
      events: userEvents(0),
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'user',
      mutateEvents: orgMutateEvents
    }
  },
  schema: {
    title: 'schema_title',
    table: {
      events: schemaEvents(0),
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
      events: translationEvents(0),
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
      events: sessionEvents(0),
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'session',
      mutateEvents: orgMutateEvents
    }
  },
  confirm: {
    title: 'confirm_title',
    table: {
      events: confirmEvents(0),
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'confirm',
      mutateEvents: orgMutateEvents
    }
  },
    note: {
    title: 'note_title',
    table: {
      events: noteEvents(0),
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'note',
      mutateEvents: noteMutateEvents
    }
  },
  org: {
    title: 'org_title',
    table: {
      events: orgEvents(0),
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key: 'org',
      mutateEvents: orgMutateEvents
    }
  }
}

export const getTableOptions =  (query) => { 
  const o = tableOptions[query.page || query.table];
  if (o) {
    o.table.query = query
    return o
  }
  return {}
}