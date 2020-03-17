<script lang='ts'>
  import { onDestroy, S, form_schema_evt, isLoggedIn, ET,E, R, RD, RA } from './modules/index'
  S.bindT([ET.get, E.form_schema_get, S.uid ], (d) => {console.log(d)}, ['menu'], 1)
</script>
hi