import { readable } from '../index'
export const current_time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date())
  }, 1000)
  return function stop() {
    clearInterval(interval)
  }
})
