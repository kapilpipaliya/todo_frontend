<script lang="ts">
  import { onMount, onDestroy, getContext, setContext } from 'svelte'
  import { get, writable } from 'svelte/store'
  import { Ws, ws_connected } from '../ws_events_dispatcher'

  import { is_production, ET, E } from '../enums'
  declare let $is_production
  const onRestart = () => {
    Ws.bindT([ET.get, E.restart_server, Ws.uid], d => 0, null)
  }
  const onRecompileFrontend = () => {
    Ws.bindT([ET.get, E.recompile_frontend, Ws.uid], d => 0, null)
  }
  const onRecompileCSS = () => {
    Ws.bindT([ET.get, E.recompile_css, Ws.uid], d => 0, null)
  }
  const onTestEmail = () => {
    Ws.bindT([ET.get, E.test_mail, Ws.uid], d => 0, null)
  }
  let log = ''
  const onReadLog = () => {
    Ws.bindT([ET.get, E.read_log, Ws.uid], d => (log = d), null)
  }
  let pass = 'super'
  const onSuperPasswordCheck = () => {
    Ws.bindT([ET.get, E.super_pass_check, Ws.uid], d => 0, pass)
  }
  const onCssSyncFilesToDB = () => {
    Ws.bindT([ET.get, E.css_sync_files_to_db, Ws.uid], d => 0, 0)
  }
  let online_user_evt = [ET.subscribe, E.subscribe_online_users, Ws.uid]
  let users = 0
  const onLineUsers = () => {
    Ws.bindT(online_user_evt, d => (users = d), 0, 1)
  }
  onLineUsers()
  onDestroy(() => {
    Ws.unbind(online_user_evt)
  })
  const getCountries = () => {
    Ws.bindT([ET.get, E.countries, Ws.uid], d => d, 0)
  }
  const getLanguages = () => {
    Ws.bindT([ET.get, E.languages, Ws.uid], d => d, 0)
  }
  const getCollectionCount = () => {
    Ws.bindT([ET.get, E.collections_size, Ws.uid], d => d, 0)
  }
</script>

{#if !$is_production}
  <div>
    <button on:click={onRestart}>Restart Server</button>
    <button on:click={onRecompileFrontend}>ReCompile Frontend</button>
    <button on:click={onRecompileCSS}>ReCompile CSS</button>
    <button on:click={onTestEmail}>Test Email</button>
    <button on:click={onReadLog}>Read Log</button>
    <input bind:value={pass} />
    <button on:click={onSuperPasswordCheck}>Super Password Check</button>
    <button on:click={onCssSyncFilesToDB}>CSS Sync Files to DB</button>
    <button on:click={getCountries}>Countries</button>
    <button on:click={getLanguages}>Languages</button>
    {users}
    <textarea bind:value={log} />
    <button on:click={getCollectionCount}>Collection count</button>
  </div>
  TODO WRITE COMPLETE HOME PAGE WITH CSS.
  <pre>
    main tasks 1. Live Talk 2. Notification(Activity) 3. Search 4. Form 5. Wiki
    6. Task Management 7. Git 8. Payment Gateway
  </pre>
{:else}
  <h1>O-K.TECH</h1>
{/if}
