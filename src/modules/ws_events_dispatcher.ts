/* Ismael Celis 2010
Simplified WebSocket events dispatcher
*/
//import IsomorphicWs from 'isomorphic-ws'
import { writable } from '../../svelte/src/runtime/store/index'; // no
import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
export const ws_connected = writable(false)
import * as M from "@msgpack/msgpack";
import {ws_todo} from './const_strings'
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
  bind(event: event, callback: callBack, handleMultiple = 0) {
    this.#callbacks[JSON.stringify(event)] = this.#callbacks[JSON.stringify(event)] ?? []
    this.#callbacks[JSON.stringify(event)].push([handleMultiple, callback]) // 0 means unsubscribe using first time
    return this
  }
  batchBind(events: Array<[event, callBack, number]> = []) {
    const payload = []
    for (let i = 0; i < events.length; i++) {
      const e = events[i]
      this.bind(e[0], e[1])
      payload.push([e[0], e[2]])
    }
    return payload
  }
  batchBindT(events: Array<[event, callBack, number]> = []) {
    const payload = this.batchBind(events)
    this.trigger(payload)
    return this
  }
  bind$(event: event, callback: callBack, handleMultiple=0) {
    this.unbind(event)
    this.bind(event, callback, handleMultiple)
    return this
  }
  bindT(event: event, callback: callBack, data, handleMultiple=0) {
    this.bind$(event, callback, handleMultiple)
    this.trigger([[event, data]])
    return () => this.unbind(event)
  }
  unbind(event: event) {this.#callbacks[JSON.stringify(event)] = [] }
  private delay_send(){
    this.#conn.send(JSON.stringify(this.#firstPayload))
    this.#isFirst = false
  }
  unbind_(event_names: Array<event> = []) {
    R.map((event:event) => {this.unbind(event) }, event_names)
    return this
  }
  trigger(payload) {
    const f = this.trigger
    switch (this.#conn.readyState) {
      case 0: // CONNECTING
        // code block
        //This will added to onopen list, take care
        this.#conn.addEventListener('open', function() {
          f(payload)
        })
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
        this.#conn.addEventListener('open', function() {
          f(payload)
        })
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
    this.dispatch(['open', '', 0], [])
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
export const S = new ServerEventsDispatcher(ws_todo, {}, {})