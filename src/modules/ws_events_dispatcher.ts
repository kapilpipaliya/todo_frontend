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

class WsBase {
  
}
export class ServerEventsDispatcher {
  private path: string;
  private req: {}
  private res: {}
  private callbacks: Record<string, any> 
  private conn: WebSocket
  private isFirst: boolean
  private firstCancelTimeout: number
  private firstPayload: Array<[]>

  constructor(path: string, req:{}, res:{}) {
    this.bind = this.bind.bind(this)
    this.bind$ = this.bind$.bind(this)
    this.bind_ = this.bind_.bind(this)
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
    this.batchBind_T = this.batchBind_T.bind(this)
    this.delay_send = this.delay_send.bind(this)

    this.path = path
    this.req = req
    this.res = res
    this.setupConnection()
    this.callbacks = {}
    this.isFirst = false
    this.firstCancelTimeout = null
    this.firstPayload = []
  }
  setupConnection() {
    this.conn = new WebSocket(this.path, [])
    // dispatch to the right handlers
    this.conn.onmessage = this.onmessage

    this.conn.onclose = this.onclose
    //this.conn.onopen = this.onopen;
    this.conn.addEventListener('open', this.onopen)
  }
  destroy() {
    this.conn.onmessage = null
    this.conn.onclose = null
    this.conn.removeEventListener('open', this.onopen)
    this.conn.close()
  }

  bind(event: event, callback: callBack, handleMultiple = 0) {
    this.callbacks[JSON.stringify(event)] = this.callbacks[JSON.stringify(event)] ?? []
    this.callbacks[JSON.stringify(event)].push([handleMultiple, callback]) // 0 means unsubscribe using first time
    return this
  }
  unbind_(event_names: Array<event> = []) {
    R.map((event:event) => {
      this.unbind(event)
    }, event_names)
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
  batchBind_T(events: Array<[event, callBack, number]> = []) {
    const payload = this.batchBind(events)
    this.trigger(payload)
    return this
  }
  bind$(event: event, callback: callBack, handleMultiple=0) {
    this.unbind(event)
    this.bind(event, callback, handleMultiple)
    return this
  }
  bind_(event: event, callback: callBack, data, handleMultiple=0) {
    this.bind$(event, callback, handleMultiple)
    this.trigger([[event, data]])
    return this
  }
  /*bind_F(event, callback, data, handleMultiple, beforeEvent, changeNotice) {
    this.bind$(event, callback, handleMultiple)
    this.triggerFile(event, data, beforeEvent, changeNotice)
    return this
  }*/
  unbind(event: event) {
    this.callbacks[JSON.stringify(event)] = []
  }
  delay_send(){
    this.conn.send(JSON.stringify(this.firstPayload))
    this.isFirst = false
  }
  trigger(payload) {
    const f = this.trigger
    switch (this.conn.readyState) {
      case 0: // CONNECTING
        // code block
        //This will added to onopen list, take care
        this.conn.addEventListener('open', function() {
          f(payload)
        })
        return this
      case 1: // OPEN
        if(this.isFirst){
          for(let i = 0; i < payload.length; i++){
            this.firstPayload.push(payload[i])
          }
          clearTimeout(this.firstCancelTimeout)
          this.firstCancelTimeout = setTimeout(this.delay_send, 50);
        } else {
          this.conn.send(JSON.stringify(payload)) // <= send JSON data to socket server
        }
        return this
      case 2: // CLOSING
      case 3: //CLOSED
        // try to reconnect/logout
        this.setupConnection()
        this.conn.addEventListener('open', function() {
          f(payload)
        })
        return this
      default:
        return this
      // code block
    }
  }
  /* todo: fix typescript errors
  triggerFile(
    event,
    data,
    beforeEvent = ['auth', 'image_meta_data', 0],
    callback
  ) {
    const f = this.triggerFile
    const f2 = this.trigger
    switch (this.conn.readyState) {
      case 0: // CONNECTING
        // code block
        //This will added to onopen list, take care
        this.conn.addEventListener('open', function() {
          f(event, data)
        })
        return this
      case 1: // OPEN
        let file = data
        let reader = new FileReader()
        let rawData = new ArrayBuffer()
        const conn = this.conn
        const bind$ = this.bind$
        reader.loadend = function() {}
        reader.onload = function(e) {
          rawData = e.target.result
          // conn.binaryType = "arraybuffer"
          f2([[beforeEvent, [event, file.name, file.size, file.type]]])

          bind$(beforeEvent, () => {
            conn.send(rawData)

            if (callback) {
              let interval = setInterval(() => {
                if (conn.bufferedAmount > 0) {
                  callback(conn.bufferedAmount)
                } else {
                  callback(0)
                  clearInterval(interval)
                }
              }, 100)
            }
          })

          // conn.binaryType = "blob"
          //alert("the File has been transferred.")
        }
        reader.readAsArrayBuffer(file)

        return this
      case 2: // CLOSING
      case 3: //CLOSED
        // try to reconnect/logout
        this.conn = new WebSocket(this.path)
        this.conn.addEventListener('open', function() {
          f(event, data)
        })
        return this
      default:
        return this
      // code block
    }
  }*/
  stringHandle(data: [   [[number, number, string], Array<{}>]  ]){
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

  async onmessage(evt: MessageEvent) {
    if (typeof evt.data === 'string') {
      const data = JSON.parse(evt.data)
      this.stringHandle(data)
    }
    // if(evt.data instanceof ArrayBuffer ){
    else {
      const blob = evt.data
      console.log(11, blob)
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

  onclose(evt: CloseEvent) {
    ws_connected.set(false)
    this.dispatch(['close', '', 0], [])
    setTimeout(() => {
      this.setupConnection()
    }, 1000)
    // on reconnection all subscribtion needs to resubscribe.
  }
  onopen(evt: Event) {
    ws_connected.set(true)
    this.isFirst = true
    //console.log(this.conn.extensions);
    //console.log("Server Opened")
    this.dispatch(['open', '', 0], [])
  }
  onerror(error: Event) {
    console.log(`[error] ${error}`)
    //todo depend on error try to reconnect
    this.dispatch(['error', '', 0], [])
  }

  dispatch(event: event, message: Array<{}>) {
    const chain = this.callbacks[JSON.stringify(event)]
    if (typeof chain == 'undefined') {
      console.log("no callbacks for this event: ", event)
    } else {
      const length = chain.length;
      for (let i = 0; i < length; i++) {
        chain[i][1](message)
        if (chain[i][0] == 0) {
          this.callbacks[JSON.stringify(event)] = []
        }
      }
    }
  }
}

/*
export const ServerEventsDispatcher = function(){
    const conn = new IsomorphicWs('ws://localhost:8300/echo');

    const callbacks = {};

    this.bind = function(event_name, callback){
      callbacks[event_name] = callbacks[event_name] ?? [];
      callbacks[event_name].push(callback);
      return this;// chainable
    };

    this.trigger2 = function(event_name, data){
      const payload = JSON.stringify([event_name, data]);
      conn.send( payload ); // <= send JSON data to socket server
      return this;
    };

    // dispatch to the right handlers
    conn.onmessage = function(evt){
      const data = JSON.parse(evt.data),
          event_name = data[0],
          message = data[1];
      dispatch(event_name, message)
    };

    conn.onclose = function(){dispatch('close',null)}
    conn.onopen = function(){dispatch('open',null)}

    const dispatch = function(event_name, message){
      const chain = callbacks[event_name];
      if(typeof chain == 'undefined') return; // no callbacks for this event
      for(let i = 0; i < chain.length; i++){
        chain[i]( message )
      }
    }
  };
*/
let ws_: ServerEventsDispatcher
ws_ = new ServerEventsDispatcher(ws_todo, {}, {})
/*ws_.bind(
  ['take_image_meta'],
  function(data) {
    ws_.event = data[0] // save value on class.
  },
  1
)*/
export const S = ws_