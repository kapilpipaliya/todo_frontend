<script lang='ts'>
  import { onMount, onDestroy, writable, setContext, getContext, get,
	S, ws_connected, event_type as et,events as e, Unique } from '../../modules/index'

const onRestart = () => {S.bindT([et.get, e.e_global, e.restart_server, Unique.id], (d) => 0, [[]] ) }
const onRecompileFrontend = () => {S.bindT([et.get, e.e_global, e.recompile_frontend, Unique.id], (d) => 0, [[]] ) } 
const onRecompileCSS = () => {S.bindT([et.get, e.e_global, e.recompile_css, Unique.id], (d) => 0, [[]] ) }
</script>

<div >
  <button on:click={onRestart}>Restart Server</button>
  <button on:click={onRecompileFrontend}>ReCompile Frontend</button>
  <button on:click={onRecompileCSS}>ReCompile CSS</button>
</div>