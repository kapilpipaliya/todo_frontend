
import { writable, S } from '../index'
import { ET, E } from '../events'
export const css_frameworks = writable(
    { bootstrap: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' },
    )
export const selected_frameworks = writable(['bootstrap'])
export const css = writable({})
const css_count_ = writable({table: 0, normalize: 0, body: 1})
export const css_count = {
  subscribe: css_count_.subscribe,
  increase: name => {
    css_count_.update(val => {
      val[name] = (val[name] || 0) + 1
      return val
    })
  },
  decrease: name => {
    setTimeout(_=>{
      css_count_.update(val => {
        val[name] = val[name]  - 1
        return val
        }
       )
    }, 2000)
  }
}
// {"table":{"classes":{},"link":"/table.5efd916f.css"}}
S.bind$([ET.get, E.css_event, 0], function(data) {css.set(data) }, 1 )