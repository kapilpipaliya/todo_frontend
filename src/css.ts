import { writable } from 'svelte/store'
import { ET, E } from './enums'
import { S } from './ws_events_dispatcher'
import { style } from 'dynamic-import'
export const css_frameworks = writable({
  bootstrap:
    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">'
})
export const selected_frameworks = writable(['bootstrap'])
export const css = writable({})
/*const css_count_ = writable({ table: 0, normalize: 0, body: 1 })
export const css_count = {
  subscribe: css_count_.subscribe,
  increase: name => {
    css_count_.update(val => {
      val[name] = (val[name] || 0) + 1
      return val
    })
  },
  decrease: name => {
    setTimeout(_ => {
      css_count_.update(val => {
        val[name] = val[name] - 1
        return val
      })
    }, 2000)
  }
}
// {"table":{"classes":{},"link":"/table.5efd916f.css"}}
S.bind$(
  [ET.get, E.css_event, 0],
  function(data) {
    css.set(data)
  },
  1
)
*/
export const css_loading = writable(false)
let cssRaw = {}

let css_add_count = 0
const css_count_ = { table: 0, normalize: 0, body: 1 }
export const css_count = {
  increase: name => {
    css_count_[name] = (css_count_[name] || 0) + 1
    if (cssRaw[name] && css_count_[name] !== 0) {
      css_loading.set(true)
      ++css_add_count
      console.log('css_add ', css_add_count, cssRaw[name].link)
      style.import(cssRaw[name].link).then(function() {
        --css_add_count
        console.log('css_remove ', css_add_count, cssRaw[name].link)
        if(css_add_count == 0) css_loading.set(false)
        console.log('css files have been loaded!', cssRaw[name].link)
      })
    }
  },
  decrease: name => {
    setTimeout(_ => {
      css_count_[name] = css_count_[name] - 1
      if (css_count_[name] == 0) {
        ++css_add_count
        console.log('css_add ', css_add_count, cssRaw[name].link)
        style.unload(cssRaw[name].link).then(function() {
          --css_add_count
          console.log('css_remove ', css_add_count, cssRaw[name].link)
          if(css_add_count == 0) css_loading.set(false)
          console.log('css files have been unloaded!', cssRaw[name].link)
        })
      }
    }, 2000)
  }
}

// {"table":{"classes":{},"link":"/table.5efd916f.css"}}
S.bind$(
  [ET.get, E.css_event, 0],
  function(data: { table: { link: '' } }) {
    css_loading.set(true)
    css.set(data)
    for (let [k, v] of Object.entries(data)) {
      if (cssRaw[k]?.link !== v.link) {
        if (css_count_[k] > 0) {
          if(cssRaw[k]?.link) {
            ++css_add_count
            console.log('css_add ', css_add_count, cssRaw[k].link)
            style.unload(cssRaw[k].link).then(function() {
              --css_add_count
              console.log('css_remove ', css_add_count, cssRaw[k].link)
              if(css_add_count == 0) css_loading.set(false)
              console.log('css files have been unloaded when setting data!')
            })
          }
          ++css_add_count
          console.log('css_add ', css_add_count, v.link)
          style.import(v.link).then(function() {
            --css_add_count
            console.log('css_remove ', css_add_count, v.link)
            if(css_add_count == 0) css_loading.set(false)
            console.log('css files have been loaded when setting data!', v.link)
          })
        }
      }
    }
    cssRaw = data
  },
  1
)
