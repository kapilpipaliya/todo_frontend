import { writable } from 'svelte/store'
import { S } from '../functions.js'
import {event_type as et, events as e} from '../events.js'

export const css_frameworks = writable(
	{ bootstrap: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' },
	
	)
export const selected_frameworks = writable(['bootstrap'])

export const css = writable(
	{ table:{
		class:{ selected: 'myselected'},
		css: {count: 0, links: ['one']}
	} } )

/*
[
  title: {
	class: {},
    css: {
    	count: 0,
    	[{}, {}, {}, {}, ...]
    }
  }
]
*/


  S.bind$(
    [et.get, e.account, e.css_event, 0],
    function(data) {
      // just properly set css store...
      console.log("i got data: ", data) 
    },
    1
  )
