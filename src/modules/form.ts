import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import * as RD from 'rambda'
import * as RX from 'rambdax'
import { ServerEventsDispatcher, Writable, writable, get, form_type, event_type as et, events as e, Unique, merge } from './index'; // not recommanded
import { notifier } from '../components/thirdparty/svelte-notifications/src/index'
import {translation} from './global_stores/translation'
import {default_form} from './global_stores/default_form'

class FormBasic {
  public S: ServerEventsDispatcher
  public key: string
  public dp:  (type: string, detail?: any) => void
  public config: {type: form_type}
  public events: Array<Array<number | string>>
  public data_evt: Array<number | string>
  public mutate_evt: Array<number | string>
  public unsub_evt: Array<number | string>
  public isUpdate: boolean
  public mounted: Writable<boolean>
  public binded: Writable<boolean>
  public form: Writable<{}>
  public er: Writable<string>
  public isSaving: Writable<boolean>
  public form_disabled: Writable<boolean>
  public schema_key: string
  public options: Writable<{}>
  public initial_form: []

  constructor(S: ServerEventsDispatcher, key:string, e: Array<Array<number | string>>, dp:  (type: string, detail?: any) => void, config={type: form_type.object}) {
    this.S = S
    this.key = key
    this.dp = dp
    this.config = config

    this.events = e;

    if(e[0]){
      if(this.key) {
        e[0][0] = et.subscribe
      } else {
        e[0][0] = et.get
      }
      this.unsub_evt = [et.unsubscribe, ...e[0].slice(1)]
    } else {
      this.unsub_evt = []
    }
    this.data_evt = e[0]
    this.mutate_evt = e[1]
    this.isUpdate = false
    
    this.mounted = writable(false)
    this.binded = writable(false)
    this.form = writable({})
    this.er = writable('')
    this.isSaving = writable(false)
    this.form_disabled = writable(true)

    this.onSave = this.onSave.bind(this)
    this.onReset = this.onReset.bind(this)
    this.onClose = this.onClose.bind(this)
    
    this.options = writable({disabled: false, notify: true})
    this.schema_key = ""
    this.initial_form = []
  }

  clearError() {
    this.er.set('')
  }
  onDestroy() {
      //if (this.key && this.unsub_evt) this.S.trigger([[this.unsub_evt, {}]])
      this.S.unbind_(this.events)
  }
  onClose() {
    if (this.key && this.unsub_evt.length) this.S.trigger([[this.unsub_evt, {}]])
  }
  fetch() {
    if(this.mutate_evt) {
      const filter = [`="${this.key}"`]
      // is schema_key passing neccessary?
      const args = ["s", filter, { ...this.config, schema: this.schema_key }] // level: project_data_store[project_data_store.length - 1]?._key ?? "" 
      const e1 = [this.mutate_evt, args]
      this.S.trigger([e1])
    }
  }
  onSave() {
    const form = get(this.form) // not recommaned to use get
    this.isSaving.set(true)
    const filter = this.isUpdate ? [`="${this.config.type == form_type.object ? form._key : form[0]}"`] : null
    // Now auto unsubscribing no need to pass  , ...(this.isUpdate ?  {unsub: this.data_evt} : {})
    const saveConfig = { ...this.config} // , form: true, schema: this.schema_key
    const args = [form, filter, saveConfig]
    if(this.isUpdate){
      args.push(this.unsub_evt)
    }
    this.S.trigger([[this.mutate_evt, args]])
  }
  onReset() {
    this.form.set(RD.clone(this.initial_form))
  }

}

export class Form extends FormBasic {
  constructor(S: ServerEventsDispatcher, key:string, e: Array<Array<number | string>>, dp:  (type: string, detail?: any) => void, config={type: form_type.object}) {
    super(S, key, e, dp, config);
    this.form = writable({})
    this.onMutateGet = this.onMutateGet.bind(this)
    this.onFormDataGet = this.onFormDataGet.bind(this)
  }
  bindMutate(){
    this.S.bind$(this.mutate_evt, this.onMutateGet, 1)
  }
  bindAll(){
    this.bindFormDataGet()
    this.bindMutate()
  }
  bindFormDataGet(){
    this.S.bind$(this.data_evt, this.onFormDataGet, 1)
  }
  onFormDataGet(d){
    this.isSaving.set(false)
    const form = Form.onFormDataGetStatic(d)
    if ((form as {_key: string})._key) {
     this.isUpdate = true
    }
    this.form.set(form)
    this.form_disabled.set(false)
  }
  onMutateGet([d]: [[boolean, string]]) {
    this.isSaving.set(false)
    let er
    if (d[0]) {
      const translation_store = get(translation)
      const save_msg = R.view(R.lensPath(['msg', 'save']), translation_store);
      const options = get(this.options)
      if(options.notify){
        notifier.success(save_msg, 3000)
      }
      er = ''
      this.dp('successSave', { key: this.key, d })
      this.onReset()
    } else {
      er = d[1]
    }
    this.er.set(er)
  }
  //static functions:
  static onFormDataGetStatic([d]:[{ r: {result:[[]] }, m: {result: [[]]}, n: {result: [[]]}, d: {} }]) {
    if (d.r) {
      const r = d.r.result
      if(r.length){
        return r[0]
      } else {
        return {}
      }
    } else if (d.n) {
      //d.n.result
    } else if (d.m) {
      const r = d.m.result
      if(r.length){
        return r[0]
      } else {
        return {}
      }
      //d.m.result
    } else if (d.d) {
      //
      return {}
    }
    return {}
  }
}
export class FormArray extends FormBasic {
  public headers: Writable<[]>
  public form: Writable<Array<number | string>>
  public schemaGetEvt: Array<number | string>
  
  constructor(S: ServerEventsDispatcher, key:string, ev: Array<Array<number | string>>, dp:  (type: string, detail?: any) => void, schema_key:string, form=[], config={type: form_type.array}) {
    super(S, key, ev, dp, config);
    this.schema_key = schema_key
    this.form = writable(form)
    this.headers = writable([])
    if(!this.data_evt) {
      this.schemaGetEvt = [et.get, e.my, e.form_schema_get, key ]
    } else {
      this.schemaGetEvt = []
    }
    this.onMutateGet = this.onMutateGet.bind(this)
    this.onSchemaDataGet = this.onSchemaDataGet.bind(this)
  }
  bindMutate(){
    this.S.bind$(this.mutate_evt, this.onMutateGet, 1)
  }
  bindAll(){
    this.bindSchemaDataGet()
    this.bindMutate()
  }
  bindSchemaDataGet(){
    if(this.schemaGetEvt) {
      this.S.bind$(this.schemaGetEvt, this.onSchemaDataGet, 1)
    }
  }
  onDestroy() {
    super.onDestroy()
    if(this.schemaGetEvt.length) {
      this.S.unbind(this.schemaGetEvt)
    }
  }
  fetch() {
    if(this.schemaGetEvt && this.schemaGetEvt.length) {
      const filter = [`="${this.key}"`]
      //const project_data_store = get(project_data)
      // , level: project_data_store[project_data_store.length - 1]?._key ?? ""   fix lavel 
      // Now auto unsubscribing no need to pass  , ...(this.isUpdate ?  {unsub: this.data_evt} : {})
      const fetchConfig = { ...this.config, schema: this.schema_key}
      const args = ["s", filter, fetchConfig] // Todo Fix on c++ side too.
      const e1 = [this.schemaGetEvt, args]
      this.S.trigger([e1])
    } else {
      super.fetch()
    }
  }
  onSchemaDataGet(d){
    //this.headers.set(d[0])
    this.onMutateGet(d)
    //super.fetch()
  }
  onMutateGet([d]) {
    if(Array.isArray(d[0])){
      const schema = d[0][0]
      const options = d[0][1] ?? {}
      const old_options = get(this.options)
      const newOptions = {...old_options, ...options}
      this.options.set(newOptions)
      this.headers.set(schema)
      const form_values = d[1]
      this.isSaving.set(false)
      const form = this.onFormDataGetStatic(form_values)
      if (form[0]) {
       this.isUpdate = true
      }
      const form_store = get(this.form)
      const new_form = merge(form_store, form)
      this.form.set(new_form)
      this.initial_form = RD.clone(new_form)
      
      this.form_disabled.set(options.ds ?? false) // options.disabled
    } else {
      this.isSaving.set(false)
      let er
      if (d[0]) {
        const translation_store = get(translation)
        const save_msg = R.view(R.lensPath(['msg', 'save']), translation_store);
        const options = get(this.options)
        if(options.notify){
          notifier.success(save_msg, 3000)
        }
        er = ''
        this.dp('successSave', { key: this.key, d })
        this.onReset()
      } else {
        er = d[1]
      }
      this.er.set(er)
    }

  }
  //static functions:
  mergeFormValues(f) {
    if(!this.isUpdate){
      const s = get(default_form)[this.schema_key]
      if(s) {
        for (let i = 0; i < f.length; i++) {
          if (s[i]) {
            f[i] = s[i]
          }
        }
      }
      return f    
    }
  }
  onFormDataGetStatic(d:{ r: {result:[[]] }, m: {result: [[]]}, n: {result: [[]]}, d: {} }) {
    if (d.r) {
      const r = d.r.result
      if(r.length){
        return this.mergeFormValues(r[0])
      } else {
        return {}
      }
    } else if (d.n) {
      //d.n.result
    } else if (d.m) {
      const r = d.m.result
      if(r.length){
        return r[0]
      } else {
        return {}
      }
      //d.m.result
    } else if (d.d) {
      //
    }
  }
}