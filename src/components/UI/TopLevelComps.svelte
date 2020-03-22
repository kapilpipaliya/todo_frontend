<script lang="ts">
  import { S } from '../../ws_events_dispatcher'
  import { ET, E } from '../../enums'
  import Css from './Css.svelte'
  import Navigate from './Navigate.svelte'
  import ScrollTop from './ScrollTop.svelte'

  import NightMode from './NightMode.svelte'
  let maintenance = false
  S.bind$(
    [ET.get, E.maintenance_event, 0],
    function(data: boolean) {
      maintenance = data
    },
    1
  )
</script>

<Css />
{#if maintenance}server is going down for sheduled maintenance{/if}
<Navigate />

<NightMode />
<ScrollTop />
