import { Writable, writable, get } from '../../svelte/src/runtime/store/index'; // not recommanded
import StorageDB from './indexdb/storage.js'
import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import { ServerEventsDispatcher, ws_connected } from './ws_events_dispatcher'
export { ServerEventsDispatcher, ws_connected } from './ws_events_dispatcher'
export { onMount, onDestroy, createEventDispatcher, beforeUpdate, tick, setContext } from '../../svelte/src/runtime/index'
export * from '../../svelte/src/runtime/store/index'
export * from '../../svelte/src/runtime/easing/index'
export * from '../../svelte/src/runtime/transition/index'
export * from '../../svelte/src/runtime/transition/index'
export * from '../../svelte/src/runtime/animate/index'
import {event_type as et, events as e} from './events'
export * from './events'
export enum form_type { object = 1, array };

export let unique_event = 0
// import {account} from './global_stores/account.js'
// import {cookie} from './global_stores/cookie.js'
// import {member_settings} from './global_stores/member_settings.js'
// import {menu} from './global_stores/menu.js'
// import {navigation} from './global_stores/navigation.js'
// import {notification} from './global_stores/notification.js'
// import {current_time} from './global_stores/time_store.js'
import {default_form} from './global_stores/default_form'

const dev_conf = {
  domain: 'localhost',
  port: 8500, //'8300' //susant : '8400' //jimmy-music // '5000' : '5001' // sce
  http_proto: 'http',
  ws_proto: 'ws',
  redirect: 'todo',
}
const prod_conf = {
  domain: 'marvelartjewellery.com',
  port: 8501,
  http_proto: 'https',
  ws_proto: 'wss',
  redirect: 'todo',
}
export const domainName = 'k.com:3000'

// export const server = process.env.NODE_ENV === 'development' ? dev_conf : prod_conf
export const server = dev_conf

export const product_img_url = `${server.http_proto}://${server.domain}:${server.port}/http/v1/user/download_id`
export const thumb_url = `${server.http_proto}://${server.domain}:${server.port}/http/v1/user/thumb_id`
export const ws_admin = `${server.ws_proto}://${server.domain}:${server.port}/jadmin`
export const ws_user = `${server.ws_proto}://${server.domain}:${server.port}/juser`
export const ws_madmin = `${server.ws_proto}://${server.domain}:${server.port}/madmin`
export const ws_todo = `${server.ws_proto}://${server.domain}:${server.port}/todo`

let ws_
ws_ = new ServerEventsDispatcher(ws_todo, {}, {})
ws_.bind(
  ['take_image_meta'],
  function(data) {
    ws_.event = data[0] // save value on class.
  },
  1
)
export const S = ws_

export const productImageBase = async (S, id, version = 0) => {
  if (false) {
    const url = await new Promise((resolve, reject) => {
      S.bind_(
        ['product', 'attachment_data', 0],
        data => {
          if (data instanceof Blob) {
            const url = URL.createObjectURL(data)
            resolve(url)
          } else {
            resolve('')
          }
          // const reader = new FileReader();
          // reader.onload = function(e) {
          // 	const url = e.target.result
          // 	resolve(url)
          // };
          // reader.readAsDataURL(data);
        },
        id
      )
    })
    return url
  } else {
    return `${product_img_url}/${id}/${version}`
  }
}

  // table:
export enum DisplayType {
    BOOL=1,
    INT,
    TEXT,
    DOUBLE,
    UTCTIME,
    ARRAY,
    OBJECT,
    BINARY,
    URL
  };

/*
import cookie from 'cookie'
export const setCookie  = res => {
    res.setHeader('Set-Cookie', cookie.serialize('name', "Dobo", {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
    }));
}*/

// dont use this function:
export const authCeck = async S => {
  const fns = []
  //const { Server: S_ } = await import("../_modules/ws_normal.js");
  //let S; if (typeof S_ == "function") { S = new S_(); } else { S = S_; }

  const isAuth = await new Promise((resolve, reject) => {
    S.bind_(
      ['user', 'is_logged_in', 0],
      ([d]) => {
        resolve(d)
      },
      [[]]
    )
  })
  if (!isAuth) {
    if (window.location.pathname !== '/admin/account/Login') {
      window.location.href = '/admin/account/Login'
    }
  }
  S.unbind_(fns)
  return isAuth
}

export const productImage = async (S, parray) => {
  for (let c of parray) {
    const idx = c[48].findIndex(v => v[3])
    const mainId = idx > -1 ? c[48][idx][0] : 0
    const version = idx > -1 ? c[48][idx][4] : 0
    const i = await productImageBase(S, mainId, version)
    c.push(i)
  }
}
export const get_p_purity_idx = (c, purity_id) => {
  let idx
  if (purity_id) {
    idx = c[46].findIndex(v => v[0] === purity_id)
  } else {
    idx = c[46].findIndex(v => v[2] === true)
  }
  // if(idx == -1) { idx = p_purities.findIndex(v => v[0] === 6) } // gold 18k
  if (idx == -1) {
    idx = c[46].length ? 0 : -1
  }
  return idx
}
export const get_p_purity_tone_idx = (tarray, tone_id) => {
  let idx
  if (tone_id) {
    idx = tarray.findIndex(v => v[0] === tone_id)
  } else {
    idx = tarray.findIndex(v => v[3] === true)
  }
  // if(idx == -1) { idx = p_purities.findIndex(v => v[0] === 6) } // gold 18k
  if (idx == -1) {
    idx = tarray.length ? 0 : -1
  }
  return idx
}
export const product_purity_price = (parray, purity_id, fn, tone_id, tfn) => {
  for (let c of parray) {
    const idx = get_p_purity_idx(c, fn ? fn(c) : purity_id)
    let main = 0 //46 =  [purity_id, [[tone_id, weight, price]] ]
    if (idx > -1) {
      const tone_array = c[46][idx][1]
      const tone_idx = get_p_purity_tone_idx(
        tone_array,
        tfn ? fn(tone_array) : tone_id
      )
      if (tone_idx > -1) {
        main = tone_array[tone_idx][2]
      }
    }
    c.push(main)
  }
}
export const get_p_clarity_idx = (c, clarity_id) => {
  let idx
  if (clarity_id) {
    idx = c[45].findIndex(v => v[0] === clarity_id)
  } else {
    idx = c[45].findIndex(v => v[4] === true)
  }
  if (idx == -1) {
    idx = c[45].length ? 0 : -1
  }
  return idx
}
export const product_clarity_price = (parray, clarity_id, fn) => {
  for (let c of parray) {
    const idx = get_p_clarity_idx(c, fn ? fn(c) : clarity_id)
    const main = idx > -1 ? c[45][idx][3] : 0
    c.push(main)
  }
}

export const first = a => (a[0] && a[0][0]) ?? 0

const getIndexValue = (arr, idx, pos) => {
  return idx > -1 && arr[idx] ? arr[idx][pos] : ''
}
export const getClarityName = (clarities, id) => {
  const idx = clarities.findIndex(v => v[0] === id)
  return getIndexValue(clarities, idx, 3)
}
export const getToneName = (tones, id) => {
  const idx = tones.findIndex(v => v[0] === id)
  return getIndexValue(tones, idx, 3)
}
export const getPurityName = (purities, id) => {
  const idx = purities.findIndex(v => v[0] === id)
  return getIndexValue(purities, idx, 3)
}

export const getToneIdx = (product, purity_idx, tone_id) => {
  const purityRow = product.p_purities_purity_id[purity_idx]
  let toneIdx = purityRow[1].findIndex(x => x[0] === tone_id)
  if (toneIdx == -1) toneIdx = 0
  return toneIdx
}
export const getPurityPrice = (product, purity_idx, tone_id) => {
  const purityRow = product.p_purities_purity_id[purity_idx]
  const toneIdx = getToneIdx(product, purity_idx, tone_id)
  return purityRow[1].length ? purityRow[1][toneIdx][2] : 0
}
export const getPrice = (product, purity_idx, tone_id, clarityPrice) => {
  return (
    getPurityPrice(product, purity_idx, tone_id) +
    clarityPrice +
    (product.p_cs_total_p_cs_total[0][2] ?? 0) +
    product.p_making_charges
  )
}

export const getTotal = (product, purity_idx, tone_id, clarityPrice) => {
  const price = getPrice(product, purity_idx, tone_id, clarityPrice)
  const dis = product.p_discount_per / 100
  const totalValue = price - price * dis
  return totalValue.toFixed(0)
}
export const getWeight = (product, purity_idx, tone_id) => {
  const purityRow = product.p_purities_purity_id[purity_idx]
  const toneIdx = getToneIdx(product, purity_idx, tone_id)
  return purityRow[1].length ? purityRow[1][toneIdx][1] : 0
}
// purity price + clarity price + making amount + p_cs_total
export const getTotalArray = p => {
  const price = p[p.length - 1] + p[p.length - 2] + p[54] + (p[51][0][2] ?? 0)
  const dis = p[55] / 100
  const totalValue = price - price * dis
  return totalValue
}
// check it already logged in
export const isLoggedIn = async S => {
  const auth = await new Promise((resolve, reject) => {
    S.bind_(
      [et.get, e.account, e.is_logged_in, 0],
      ([d]) => {
        resolve(d)
      },
      [[]]
    )
  })
  return auth
}

export const getSettingCache = async key => {
  const db = new StorageDB('setting', 1)
  const setting = await db.getItem(key)
  return setting
}

export function uPath() {
  return window.location.pathname
}
export function pPath() {
  const path = window.location.pathname
  // https://stackoverflow.com/questions/10886727/remove-last-element-from-url
  return path.slice(0, path.lastIndexOf('/'))
}
//https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
export function getCookieValue(a) {
  var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)')
  return b ? b.pop() : ''
}
class FormBasic {
  public S: ServerEventsDispatcher
  public key: string
  public dp:  (type: string, detail?: any) => void
  public type: form_type
  public events: Array<[]>
  public data_evt: []
  public mutate_evt: []
  public unsub_evt: Array<[]>
  public isUpdate: boolean
  public mounted: Writable<boolean>
  public binded: Writable<boolean>
  public form: Writable<{}>
  public er: Writable<string>
  public isSaving: Writable<boolean>
  public form_disabled: Writable<boolean>
  public schema_key: string
  public options: Writable<{}>

  constructor(S, key, e, dp, type=form_type.object) {
    this.S = S
    this.key = key
    this.dp = dp
    this.type = type

    this.events = e;

    if(e[1]){
      if(this.key) {
        e[1][0] = et.subscribe
      } else {
        e[1][0] = et.get
      }
      this.unsub_evt = [et.unsubscribe, ...e[1].slice(1)]
    }
    this.data_evt = e[1]
    this.mutate_evt = e[2]
    this.isUpdate = false
    
    this.mounted = writable(false)
    this.binded = writable(false)
    this.form = writable({})
    this.er = writable('')
    this.isSaving = writable(false)
    this.form_disabled = writable(true)

    this.onSave = this.onSave.bind(this)
    this.onMutateGet = this.onMutateGet.bind(this)
    this.options = writable({})
  }
  bindMutate(){
    this.S.bind$(this.mutate_evt, this.onMutateGet, 1)
  }
  clearError() {
    this.er.set('')
  }
  onDestroy() {
      if (this.key && this.unsub_evt) this.S.trigger([[this.unsub_evt, {}]])
      this.S.unbind_(this.events)
  }
  fetch() {
    if(this.data_evt) {
      const filter = [`="${this.key}"`]
      const args = [filter, [], [], { type: this.type, form: true, schema: this.schema_key }]
      const e1 = [this.data_evt, args]
      this.S.trigger([e1])
    }
  }
  onSave() {
    const form = get(this.form) // not recommaned to use get
    this.isSaving.set(true)
    const filter = this.isUpdate ? [`="${this.type == form_type.object ? form._key : form[0]}"`] : null
    this.S.trigger([[this.mutate_evt, [form, filter]]])
  }
  onMutateGet([d]) {
    this.isSaving.set(false)
    let er
    if (d[0]) {
      er = ''
      this.dp('successSave', { key: this.key, d })
    } else {
      er = d[1]
    }
    this.er.set(er)
  }
}

export class Form extends FormBasic {
  constructor(S, key, e, dp, type=form_type.object) {
    super(S, key, e, dp, type);
    this.form.set({})
    this.onFormDataGet = this.onFormDataGet.bind(this)
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
    if (form._key) {
     this.isUpdate = true
    }
    this.form.set(form)
    this.form_disabled.set(false)
  }
  //static functions:
  static onFormDataGetStatic([d]) {
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
    }
  }
}
export class FormArray extends FormBasic {
  public headers: Writable<[]>
  public form: Writable<[]>
  public schemaGetEvt: number[]
  constructor(S, key, ev, dp, schema_key, type=form_type.array) {
    super(S, key, ev, dp, type);
    this.schema_key = schema_key
    this.form.set([])
    this.headers = writable([])
    if(!this.data_evt) {
      this.schemaGetEvt = [et.get, e.my, e.form_schema_get, key ]
      this.onSchemaDataGet = this.onSchemaDataGet.bind(this)
    }
    this.onFormDataGet = this.onFormDataGet.bind(this)
  }
  bindAll(){
    this.bindSchemaDataGet()
    this.bindFormDataGet()
    this.bindMutate()
  }
  bindSchemaDataGet(){
    if(this.schemaGetEvt) {
      this.S.bind$(this.schemaGetEvt, this.onSchemaDataGet, 1)
    }
  }
  bindFormDataGet(){
    if(this.data_evt) {
      this.S.bind$(this.data_evt, this.onFormDataGet, 1)
    }
  }
  onDestroy() {
    super.onDestroy()
    if(this.schemaGetEvt) {
      this.S.unbind_(this.schemaGetEvt)
    }
  }
  fetch() {
    if(this.schemaGetEvt) {
      const filter = [`="${this.key}"`]
      const args = [filter, [], [], { type: this.type, form: true, schema: this.schema_key }]
      const e1 = [this.schemaGetEvt, args]
      this.S.trigger([e1])
    } else {
      super.fetch()
    }
  }
  onSchemaDataGet(d){
    //this.headers.set(d[0])
    this.onFormDataGet(d)
    super.fetch()
  }
  onFormDataGet([d]){
    const schema = d[0][0]
    const options = d[0][1] ?? {disabled: false}
    this.options.set(options)
    this.headers.set(schema)
    const form_values = d[1]
    this.isSaving.set(false)
    const form = this.onFormDataGetStatic(form_values)
    if (form[0]) {
     this.isUpdate = true
    }
    this.form.set(form)
    this.form_disabled.set(false || options.disabled)
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
  onFormDataGetStatic(d) {
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

export function i18n(name, lang = 'en'){
  if (RA.isString(name)) {
    return name
  } else if(RA.isObject(name)) {
    return name[lang]
  }
  return "i18n Error"
}
export const form_schema_evt = (id) => [et.get, e.my, e.form_schema_get, id ]


export enum level_of_member {
  predefined, super_admin, organization, project
}