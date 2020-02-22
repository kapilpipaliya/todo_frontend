<script lang='ts'>
  import { notification } from './store'
  import { onMount, onDestroy } from '../../../../../svelte/src/runtime/index'
  import { css_count } from '../../../../modules/global_stores/css'
  export let themes = {
    danger: '#bb2124',
    success: '#22bb33',
    warning: '#f0ad4e',
    info: '#5bc0de',
    default: '#aaaaaa',
  }

  export let timeout = 3000

  let count = 0
  let toasts = []
  let unsubscribe

  function animateOut(node, { delay = 0, duration = 300 }) {
    function vhTOpx(value) {
      var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight

      return (y * value) / 100
    }

    return {
      delay,
      duration,
      css: t =>
        `opacity: ${(t - 0.5) *
          1}; transform-origin: top right; transform: scaleX(${(t - 0.5) *
          1});`,
    }
  }

  function createToast(msg, theme, to) {
    const background = themes[theme] || themes['default']
    toasts = [
      {
        id: count,
        msg,
        background,
        timeout: to || timeout,
        width: '100%',
      },
      ...toasts,
    ]
    count = count + 1
  }

  unsubscribe = notification.subscribe(value => {
    if (!value || !value.type) {
      return
    }
    createToast(value.message, value.type, value.timeout)
    notification.set({})
  })
  
  css_count.increase('notifications')
  onDestroy(() => {
    unsubscribe()
    css_count.decrease('notifications')
  })
  //onDestroy(unsubscribe)

  function removeToast(id) {
    toasts = toasts.filter(t => t.id != id)
  }
</script>

<ul class="toasts">
  {#each toasts as toast (toast.id)}
    <li class="toast" style="background: {toast.background};" out:animateOut>
      <div class="content">{toast.msg}</div>
      <div
        class="progress"
        style="animation-duration: {toast.timeout}ms;"
        on:animationend={() => removeToast(toast.id)} />
    </li>
  {/each}
</ul>
