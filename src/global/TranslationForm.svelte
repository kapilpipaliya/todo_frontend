<script>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, schemaMutateEvents, Form } from '../modules/functions.js'
  import { beforeUpdate, tick } from 'svelte';
  import { SubmitButton, CancelButton } from '../components/index.js'
  export let key = 0
  export let eventsFn = () => 0
  const f = new Form(S, key, eventsFn(key), createEventDispatcher()), er = f.er, isSaving = f.isSaving, form = f.form, mounted = f.mounted, binded = f.binded
  let jsoneditorformDom = null
  let editorform
  $: $form._key = $form._key || '';
  onMount(async () => {
    const options = {
            mode: 'code',
            modes: ["code", "tree"],
          };
    await import(
      "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.5/jsoneditor.min.js"
    );
    await tick();
    editorform = new JSONEditor(jsoneditorformDom, options, $form.form || {})
    $mounted = true
  })
  onDestroy(() => {f.onDestroy() })
  $: if ($mounted) {if ($ws_connected) {$er = ''; funcBindingOnce() } else {$er = 'Reconnecting...'} }
  const funcBindingOnce = () => {
    if (!$binded) {
      S.bind$(f.data_evt, (d) => {
        f.onFormDataGet(d)
        if (d[0].r) {
          editorform.set($form.form || {})
        }
      }, 1)
      f.bindMutate()
      f.fetch()
      $binded = true
    }
  }
  function onSave() {
    $form = editorform.get()
    f.onSave()
  }
</script>
<svelte:head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.5/jsoneditor.min.css" rel="stylesheet" type="text/css">
</svelte:head>
<form on:submit|preventDefault={onSave}>
  <label>
    <span>Key</span>
    <input name='key' type="text" bind:value={$form._key} required />
  </label>
  <div style="display: flex;">
    <div>
      <div>Object:</div>
      <div name='form' bind:this={jsoneditorformDom} style="width: 1200px; height: 400px;" />
    </div>
  </div>
  <div>{$er}</div>
  <footer>
    <SubmitButton isSaving={$isSaving} />
    <CancelButton isSaving={$isSaving} {key} on:close />
  </footer>
</form>
