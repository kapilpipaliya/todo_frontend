import { writable } from 'svelte/store'
import { S } from '../functions.ts'
import {event_type as et, events as e } from '../events.ts'
//write me
export const menu = writable({})


  S.bind$(e.menu_event, (d) => {
    
  }, 1)

