<script>
  import { onMount } from '../../../../modules/functions.ts'

  import { SpaRouter } from '../router.js'
  import Route from './route.svelte'
  import { activeRoute } from '../store.ts'

  export let routes = []
  export let options = {}

  onMount(async function() {
    await SpaRouter(routes, document.location.href, options).setActiveRoute()
  })
</script>

<Route currentRoute={$activeRoute} />
