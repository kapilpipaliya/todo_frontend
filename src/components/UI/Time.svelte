<script lang="ts">
import { readable } from 'svelte/store'

  export const current_time = readable(new Date(), function start(set) {
    const interval = setInterval(() => {
      set(new Date())
    }, 1000)
    return function stop() {
      clearInterval(interval)
    }
  })

  const formatter = new Intl.DateTimeFormat('en', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });
</script>

<h1>The time is {formatter.format($current_time)}</h1>
