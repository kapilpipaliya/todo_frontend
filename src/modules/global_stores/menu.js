import { writable } from 'svelte/store'
import { S } from '../functions.js'
import {event_type as et, events as e } from '../events.js'
//write me
export const menu = writable({})


  S.bind$(e.menu_event, (d) => {
    
  }, 1)

