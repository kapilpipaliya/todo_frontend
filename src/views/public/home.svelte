<script lang='ts'>
  import { onMount, onDestroy, writable, setContext, getContext, get,
	S, ws_connected, ET,E } from '../../modules/index'
const onRestart = () => {S.bindT([ET.get,  E.restart_server, S.uid], (d) => 0, [[]] ) }
const onRecompileFrontend = () => {S.bindT([ET.get,  E.recompile_frontend, S.uid], (d) => 0, [[]] ) } 
const onRecompileCSS = () => {S.bindT([ET.get,  E.recompile_css, S.uid], (d) => 0, [[]] ) }
const onTestEmail = () => {S.bindT([ET.get,  E.test_mail, S.uid], (d) => 0, [[]] ) }
let log = ''
const onReadLog = () => {S.bindT([ET.get,  E.read_log, S.uid], (d) => log = d, [[]] ) }
let pass = 'super'
const onSuperPasswordCheck = () => {S.bindT([ET.get,  E.super_pass_check, S.uid], (d) => 0, pass ) }
const onCssSyncFilesToDB = () => {S.bindT([ET.get,  E.css_sync_files_to_db, S.uid], (d) => 0, 0 ) }
let online_user_evt = [ET.subscribe,  E.subscribe_online_users, S.uid]
let users = 0
const onLineUsers = () => {S.bindT(online_user_evt, (d) => users = d, 0, 1 ) }
onLineUsers()
onDestroy(() => {S.unbind(online_user_evt) })
const getCountries = () => {S.bindT([ET.get,  E.countries, S.uid], (d) => console.log(d), 0 ) }
const getLanguages = () => {S.bindT([ET.get,  E.languages, S.uid], (d) => console.log(d), 0 ) }
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
  <button on:click={getCountries}>Countries</button>
  <button on:click={getLanguages}>Languages</button>
  {users}
  <textarea bind:value={log}></textarea>
</div>


TODO WRITE COMPLETE HOME PAGE WITH CSS.


