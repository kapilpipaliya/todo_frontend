<script lang='ts'>
  import { onMount, onDestroy, writable, setContext, getContext, get,
	S, ws_connected, ET,E } from '../../modules/index'
const onRestart = () => {S.bindT([ET.get, E.e_global, E.restart_server, S.uid], (d) => 0, [[]] ) }
const onRecompileFrontend = () => {S.bindT([ET.get, E.e_global, E.recompile_frontend, S.uid], (d) => 0, [[]] ) } 
const onRecompileCSS = () => {S.bindT([ET.get, E.e_global, E.recompile_css, S.uid], (d) => 0, [[]] ) }
const onTestEmail = () => {S.bindT([ET.get, E.e_global, E.test_mail, S.uid], (d) => 0, [[]] ) }
let log = ''
const onReadLog = () => {S.bindT([ET.get, E.e_global, E.read_log, S.uid], (d) => log = d, [[]] ) }
let pass = 'super'
const onSuperPasswordCheck = () => {S.bindT([ET.get, E.e_global, E.super_pass_check, S.uid], (d) => 0, pass ) }
const onCssSyncFilesToDB = () => {S.bindT([ET.get, E.e_global, E.css_sync_files_to_db, S.uid], (d) => 0, 0 ) }
let online_user_evt = [ET.subscribe, E.e_global, E.subscribe_online_users, S.uid]
let users = 0
const onLineUsers = () => {S.bindT(online_user_evt, (d) => users = d, 0, 1 ) }
onLineUsers()
onDestroy(() => {S.unbind(online_user_evt) })
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
  {users}
  <textarea bind:value={log}></textarea>
</div>