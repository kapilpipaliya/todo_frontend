import { writable } from 'svelte/store'
import { ET, E } from './enums'
import { S } from './ws_events_dispatcher'
export const css_frameworks = writable({
  bootstrap:
    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">'
})
export const selected_frameworks = writable(['bootstrap'])
export const css = writable({})
const css_count_ = writable({ table: 0, normalize: 0, body: 1 })
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

/*
let cssRaw = {}

//https://github.com/brianleroux/loads-css/blob/master/es6.js
function loadCSS(href, callback) {
  var ss = window.document.createElement( "link" );
  var ref = window.document.getElementsByTagName( "script" )[ 0 ];
  var sheets = window.document.styleSheets;
  ss.rel = "stylesheet";
  ss.href = href;
  // temporarily, set media to something non-matching to ensure it'll fetch without blocking render
  ss.media = "only x";
  // inject link
  ref.parentNode.insertBefore( ss, ref );
  // This function sets the link's media back to `all` so that the stylesheet applies once it loads
  // It is designed to poll until document.styleSheets includes the new sheet.
  function toggleMedia(){
    var defined;
    for( var i = 0; i < sheets.length; i++ ){
      if( sheets[ i ].href && sheets[ i ].href.indexOf( href ) > -1 ){
        defined = true;
      }
    }
    if( defined ){
      ss.media = "all";
            callback()
    }
    else {
      setTimeout( toggleMedia );
    }
  }
  toggleMedia();
  return ss;
}

let callbacks: Record<string, any> = {}

const css_count_ = { table: 0, normalize: 0, body: 1 }
export const css_count = {
  increase: name => {
    css_count_[name] = (css_count_[name] || 0) + 1
    if(!callbacks[name] && cssRaw[name]) callbacks[name] = loadCSS(cssRaw[name].link, ()=>0)
  },
  decrease: name => {
    setTimeout(_ => {
      css_count_[name] = css_count_[name] - 1
      if(css_count_[name] == 0 && callbacks[name])  callbacks[name].remove()
    }, 2000)
  }
}

// {"table":{"classes":{},"link":"/table.5efd916f.css"}}
S.bind$(
  [ET.get, E.css_event, 0],
  function(data:{"table":{link: ""}}) {
    css.set(data)
    for (let [k, v] of Object.entries(data)) {
      if(cssRaw[k]?.link !== v.link){
         if(css_count_[k] > 0) {
           if(callbacks[k]) {
             callbacks[k].remove()
           }
           callbacks[k] = loadCSS(v.link, ()=>0)
         }
      }
    }
    cssRaw=data
  },
  1
)
*/
