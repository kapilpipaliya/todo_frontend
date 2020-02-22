<script lang='ts'>
  import { onMount, onDestroy, writable, setContext, getContext, get,
	S, ws_connected, event_type as et,events as e, ValueType, Unique } from '../../modules/index'

const onRestart = () => {
    S.bind_(
      [et.get, e.e_global, e.restart_server, Unique.id],
      ([d]) => {
        // console.warn(d)
      },
      [[]]
    )
  }
const onRecompileFrontend = () => {
    S.bind_(
      [et.get, e.e_global, e.recompile_frontend, Unique.id],
      ([d]) => {
        // console.warn(d)
      },
      [[]]
    )
  }
const onRecompileCSS = () => {
    S.bind_(
      [et.get, e.e_global, e.recompile_css, Unique.id],
      ([d]) => {
        // console.warn(d)
      },
      [[]]
    )
  }
</script>

<div >
<button on:click={onRestart}>Restart Server</button>
<button on:click={onRecompileFrontend}>ReCompile Frontend</button>
<button on:click={onRecompileCSS}>ReCompile CSS</button>
</div>