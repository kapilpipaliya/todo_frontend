<script lang='ts'>
  import { ET, E, form_schema_evt } from './events'
  import { onDestroy } from 'svelte'
  import { S } from './ws_events_dispatcher'
  import { isLoggedIn,} from './api_helper'
  S.bindT([ET.get, E.form_schema_get, S.uid ], (d) => {console.log(d)}, ['menu'], 1)
</script>
hi