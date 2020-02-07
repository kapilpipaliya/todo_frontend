
import { writable, S } from '../index'
import { event_type as et, events as e } from '../events'

export const css_frameworks = writable(
    { bootstrap: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' },

    )
export const selected_frameworks = writable(['bootstrap'])

export const css = writable(
    { table:{
      classes:{ selected: 'myselected'},
      link: 'one'
     }
  } )
export const css_count = writable({'table': 0})

// {"table":{"classes":{},"link":"/table.5efd916f.css"}}
  S.bind$(
    [et.get, e.account, e.css_event, 0],
    function(data) { // : [{}]
      // console.log("i got data: ", data)
      css.set(data[0])
    },
    1
  )
