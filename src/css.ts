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

// https://github.com/pyrsmk/toast
class Toast {
  /**
   * Load several resources from URLs
   *
   * @param {string[]} urls
   * @return {Promise<HTMLElement[]>}
   */
  public all(urls: string[]): Promise<HTMLElement[]> {
    return Promise.all(
      urls.map(
        (url): Promise<HTMLElement> => {
          switch (
            url
              .split('.')
              .pop()!
              .toLowerCase()
          ) {
            case 'css':
              return this.css(url)
            case 'js':
              return this.js(url)
            default:
              return Promise.reject(
                new Error(`Unable to detect extension of '${url}'`)
              )
          }
        }
      )
    )
  }

  /**
   * Load a CSS URL
   *
   * @param {string} url
   * @return {Promise<HTMLElement>}
   */
  public css(url: string): Promise<HTMLElement> {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    document.querySelector('head')!.appendChild(link)
    return this.promise(link)
  }

  /**
   * Load a JS URL
   *
   * @param {string} url
   * @return {Promise<HTMLElement>}
   */
  public js(url: string): Promise<HTMLElement> {
    const script = document.createElement('script')
    script.src = url
    document.querySelector('head')!.appendChild(script)
    return this.promise(script)
  }

  /**
   * Create a promise based on an HTMLElement
   * @param {HTMLElement} element
   * @return {Promise<HTMLElement>}
   */
  private promise(element: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve, reject): void => {
      element.addEventListener('load', (): void => {
        resolve(element)
      })
      element.addEventListener('error', (): void => {
        reject()
      })
    })
  }
}

const T = new Toast()

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
      //console.log('css_add ', css_add_count, cssRaw[name].link)
      T.css(cssRaw[name].link).then(function() {
        --css_add_count
        //console.log('css_remove ', css_add_count, cssRaw[name].link)
        if (css_add_count == 0) css_loading.set(false)
        //console.log('css files have been loaded!', cssRaw[name].link)
      })
    }
  },
  decrease: name => {
    setTimeout(_ => {
      css_count_[name] = css_count_[name] - 1
      if (css_count_[name] == 0) {
        // note: not calling css_loading.set(true) because onDestory life cycle is called too late!
        ++css_add_count
        //console.log('css_add ', css_add_count, cssRaw[name].link)
        style.unload(cssRaw[name].link).then(function() {
          --css_add_count
          //console.log('css_remove ', css_add_count, cssRaw[name].link)
          if (css_add_count == 0) css_loading.set(false)
          //console.log('css files have been unloaded!', cssRaw[name].link)
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
          if (cssRaw[k]?.link) {
            ++css_add_count
            //console.log('css_add ', css_add_count, cssRaw[k].link)
            style.unload(cssRaw[k].link).then(function() {
              --css_add_count
              //console.log('css_remove ', css_add_count, cssRaw[k].link)
              if (css_add_count == 0) css_loading.set(false)
              //console.log('css files have been unloaded when setting data!')
            })
          }
          ++css_add_count
          //console.log('css_add ', css_add_count, v.link)
          T.css(v.link).then(function() {
            --css_add_count
            //console.log('css_remove ', css_add_count, v.link)
            if (css_add_count == 0) css_loading.set(false)
            //console.log('css files have been loaded when setting data!', v.link)
          })
        }
      }
    }
    cssRaw = data
  },
  1
)
