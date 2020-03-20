/* Ismael Celis 2010
Simplified WebSocket events dispatcher
*/
//import IsomorphicWs from 'isomorphic-ws'
import { writable } from 'svelte/store' // no
import { map } from 'ramda'
export const ws_connected = writable(false)
import * as M from "@msgpack/msgpack";
import {WS_PATH} from './const_strings'

import { ET, E } from './events'
import { saveCookie } from './cookie_functions'
/*
usage:
for $ prefix use always check if(mounted) first.
*/
// import * as cookie from 'cookie';
//import m from "@msgpack/msgpack";
//const {encode, decode} = m;
// const data = decode(evt.data)

// same library:
//A WebSocket JavaScript library https://sarus.anephenix.com
//https://github.com/anephenix/sarus
type callBack = (d: any) => void;
type event = Array<number | string>
export class ServerEventsDispatcher {
  readonly #path: string;
  private id_ = 0
  #req: {}
  #res: {}
  #callbacks: Record<string, any>
  #fetchOnce // handle at component level, until i found solution.
  #conn: WebSocket
  #isFirst: boolean
  #firstCancelTimeout: number
  #firstPayload: Array<[]>
  constructor(path: string, req:{}, res:{}) {
    this.#path = path
    this.#req = req
    this.#res = res
    this.#callbacks = {}
    this.#isFirst = false
    this.#firstCancelTimeout = null
    this.#firstPayload = []
    this.#fetchOnce = []
    this.bind = this.bind.bind(this)
    this.bind$ = this.bind$.bind(this)
    this.bindT = this.bindT.bind(this)
    //this.bind_F = this.bind_F.bind(this)
    this.unbind = this.unbind.bind(this)
    this.unbind_ = this.unbind_.bind(this)
    this.trigger = this.trigger.bind(this)
    //this.triggerFile = this.triggerFile.bind(this)
    this.onmessage = this.onmessage.bind(this)
    this.onclose = this.onclose.bind(this)
    this.onopen = this.onopen.bind(this)
    this.onerror = this.onerror.bind(this)
    this.dispatch = this.dispatch.bind(this)
    this.batchBind = this.batchBind.bind(this)
    this.batchBindT = this.batchBindT.bind(this)
    this.delay_send = this.delay_send.bind(this)
    this.setupConnection()
  }
  get uid(){return ++this.id_ }
  setupConnection() {
    this.#conn = new WebSocket(this.#path, [])
    // dispatch to the right handlers
    this.#conn.onmessage = this.onmessage
    this.#conn.onclose = this.onclose
    //this.conn.onopen = this.onopen;
    this.#conn.addEventListener('open', this.onopen)
  }
  destroy() {
    this.#conn.onmessage = null
    this.#conn.onclose = null
    this.#conn.removeEventListener('open', this.onopen)
    this.#conn.close()
  }
  bind(event: event, callback: callBack, handleMultiple = 0, data=[]) {
    this.#callbacks[JSON.stringify(event)] = this.#callbacks[JSON.stringify(event)] ?? []
    this.#callbacks[JSON.stringify(event)].push([handleMultiple, callback, data]) // 0 means unsubscribe using first time
    return this
  }
  batchBind(events: Array<[event, callBack, any]> = []) {
    const payload = []
    for (let i = 0; i < events.length; i++) {
      const e = events[i]
      this.bind(e[0], e[1])
      payload.push([e[0], e[2]])
    }
    return payload
  }
  batchBindT(events: Array<[event, callBack, any]> = []) {
    const payload = this.batchBind(events)
    this.trigger(payload)
    return this
  }
  bind$(event: event, callback: callBack, handleMultiple=0, data=[]) {
    this.unbind(event)
    this.bind(event, callback, handleMultiple)
    return this
  }
  bindT(event: event, callback: callBack, data, handleMultiple=0) {
    this.bind$(event, callback, handleMultiple, data)
    this.trigger([[event, data]])
    return () => this.unbind(event)
  }
  unbind(event: event) {this.#callbacks[JSON.stringify(event)] = [] }
  unbind_(event_names: Array<event> = []) {
    map((event:event) => {this.unbind(event) }, event_names)
    return this
  }
  private delay_send(){
    if(this.#firstPayload){
      this.#conn.send(JSON.stringify(this.#firstPayload))
    }
    this.#isFirst = false
  }
  trigger(payload) {
    const f = this.trigger
    switch (this.#conn.readyState) {
      case 0: // CONNECTING
        // code block
        //This will added to onopen list, take care
        //this.#conn.addEventListener('open', () => {
          //f(payload)
          this.#firstPayload.push(...payload)
        //})
        return this
      case 1: // OPEN
        if(this.#isFirst){
          for(let i = 0; i < payload.length; i++){
            this.#firstPayload.push(payload[i])
          }
          clearTimeout(this.#firstCancelTimeout)
          this.#firstCancelTimeout = setTimeout(this.delay_send, 50);
        } else {
          this.#conn.send(JSON.stringify(payload)) // <= send JSON data to socket server
        }
        return this
      case 2: // CLOSING
      case 3: //CLOSED
        // try to reconnect/logout
        this.setupConnection()
        //this.#conn.addEventListener('open', () => {
          this.#firstPayload.push(...payload)
          //f(payload)
        //})
        return this
      default:
        return this
      // code block
    }
  }
  private stringHandle(data: [   [[number, number, string], Array<{}>]  ]){
    if(!Array.isArray(data)){
      console.warn('return data must be an array.', data)
    } else {
      try {
        for (let i = 0; i < data.length; i++) {
          const e = data[i]
          if(!Array.isArray(e) || e.length < 2){
            console.warn('event array should have >= 2 elements, got: ', e)
          }
          const event = e[0]
          const message = e.splice(1)
          this.dispatch(event, message)
        }
      } catch (error) {
        console.warn('error: ', error)
        console.warn(data)
      }
    }
  }

  private async onmessage(evt: MessageEvent) {
    if (typeof evt.data === 'string') {
      const data = JSON.parse(evt.data)
      this.stringHandle(data)
    }
    // if(evt.data instanceof ArrayBuffer ){
    else {
      const blob = evt.data
      const buffer = await blob.arrayBuffer();
      const data = M['default']['decode'](buffer)
      this.stringHandle(data)
      //console.log('Received arraybuffer')
      //this.dispatch(this.event, buffer) // uncomment
    }
    // if(evt.data instanceof Blob ){
    //   const buffer = event.data;
    //   console.log("Received arraybuffer");
    //   this.dispatch(this.event_name, buffer)
    // }
  }
  private onclose(evt: CloseEvent) {
    ws_connected.set(false)
    this.dispatch(['close', '', 0], [])
    setTimeout(() => {
      this.setupConnection()
    }, 1000)
    // on reconnection all subscribtion needs to resubscribe.
  }
  private onopen(evt: Event) {
    ws_connected.set(true)
    this.#isFirst = true
    //console.log(this.conn.extensions);
    //console.log("Server Opened")
    this.#firstCancelTimeout = setTimeout(this.delay_send, 50);
    this.dispatch(['open', '', 0], [])
    // const length = this.#callbacks.length;
    //   for (let i = 0; i < length; i++) {
    //     chain[i][1](...message)
    //     if (chain[i][0] == 0) {
    //       this.#callbacks[JSON.stringify(event)] = []
    //     }
    //   }

  }
  private onerror(error) {
    console.warn(error.message)
    console.warn(`[error] ${error}`)
    //todo depend on error try to reconnect
    this.dispatch(['error', '', 0], [])
  }
  private dispatch(event: event, message: Array<{}>) {
    const chain = this.#callbacks[JSON.stringify(event)]
    if (typeof chain == 'undefined') {
      console.warn("no callbacks for this event: ", event)
    } else {
      const length = chain.length;
      for (let i = 0; i < length; i++) {
        chain[i][1](...message)
        if (chain[i][0] == 0) {
          this.#callbacks[JSON.stringify(event)] = []
        }
      }
    }
  }
}
export const S = new ServerEventsDispatcher(WS_PATH, {}, {})

S.bind$([ET.get, E.cookie_event, 0], saveCookies, 1)
function saveCookies(data) {
  Object.keys(data.cookie).forEach(key => {
    saveCookie(key, data.cookie[key], data.max_age)
  })
}
