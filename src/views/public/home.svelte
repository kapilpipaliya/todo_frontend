<script lang='ts'>
  import { onMount, onDestroy, writable, setContext, getContext, get,
	S, ws_connected, event_type as et,events as e, Unique } from '../../modules/index'

const onRestart = () => {S.bindT([et.get, e.e_global, e.restart_server, Unique.id], (d) => 0, [[]] ) }
const onRecompileFrontend = () => {S.bindT([et.get, e.e_global, e.recompile_frontend, Unique.id], (d) => 0, [[]] ) } 
const onRecompileCSS = () => {S.bindT([et.get, e.e_global, e.recompile_css, Unique.id], (d) => 0, [[]] ) }
const onTestEmail = () => {S.bindT([et.get, e.e_global, e.test_mail, Unique.id], (d) => 0, [[]] ) }
const onReadLog = () => {S.bindT([et.get, e.e_global, e.read_log, Unique.id], (d) => 0, [[]] ) }
let pass = 'super'
const onSuperPasswordCheck = () => {S.bindT([et.get, e.e_global, e.super_pass_check, Unique.id], (d) => 0, pass ) }
const onCssSyncFilesToDB = () => {S.bindT([et.get, e.e_global, e.css_sync_files_to_db, Unique.id], (d) => 0, 0 ) }
</script>

<div >
  <button on:click={onRestart}>Restart Server</button>
  <button on:click={onRecompileFrontend}>ReCompile Frontend</button>
  <button on:click={onRecompileCSS}>ReCompile CSS</button>
  <button on:click={onTestEmail}>Test Email</button>
  <button on:click={onReadLog}>Read Log</button>
  <input bind:value={pass} >
  <button on:click={onSuperPasswordCheck}>Super Password Check</button>
  <button on:click={onCssSyncFilesToDB}>CSS Sync Files to DB</button>
</div>