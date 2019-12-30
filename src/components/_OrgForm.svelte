<script>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, orgMutateEvents, Form } from '../modules/functions.ts'
  import { SubmitButton, CancelButton } from '../components/index.js'
  export let key = 0
  const f = new Form(S, key, orgMutateEvents(key), createEventDispatcher()), er = f.er, isSaving = f.isSaving, form = f.form, mounted = f.mounted, binded = f.binded
  onMount(() => {$mounted = true })
  onDestroy(() => {f.onDestroy() })
  $: if ($mounted) {if ($ws_connected) {$er = ''; funcBindingOnce(); } else {$er = 'Reconnecting...'} }
  function funcBindingOnce () {if (!$binded) {f.bindAll(); f.fetch(); $binded = true; }}
</script>
<form on:submit|preventDefault={f.onSave}>
  <label>
    <span>Name</span>
    <input name="name" type="text" bind:value={$form.name} required />
  </label>
  <label>
    <span>Surname</span>
    <input name="surname" type="text" bind:value={$form.surname} required />
  </label>
  <label>
    <span>Disabled</span>
    <input type="checkbox" bind:checked={$form.disabled} />
  </label>
  <div>{$er}</div>
  <footer>
    <SubmitButton isSaving={$isSaving} />
    <CancelButton isSaving={$isSaving} {key} on:close />
  </footer>
</form>
