import { writable } from 'svelte/store'
import { S } from '../functions.js'
import {event_type, events} from '../events.js'
//write me
export const menu = writable({})

menu.subscribe(value => {
  console.log(value)
})

if (process.browser) {
  S.bind$(events.menu_event, (d) => {
    
  }, 1)

}