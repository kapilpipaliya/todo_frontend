<script>
  import { onDestroy } from 'svelte'
  import MapGeo from "../../../../thirdparty/map-geo-countries/src/App.svelte"
  import { css_count } from '../../../css'
  css_count.increase('mapcountries')
  onDestroy(()=>{css_count.decrease('mapcountries') })
  //let value = ''
</script>
<div class='mapcountries' style="height: 600px;">
<MapGeo  />
</div>
