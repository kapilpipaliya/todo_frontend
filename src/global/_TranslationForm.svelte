<script>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, schemaMutateEvents, Form } from '../_modules/functions.js'
  import { SubmitButton, CancelButton } from '../_components/index.js'
  export let key = 0
  const f = new Form(S, key, schemaMutateEvents(key), createEventDispatcher()), er = f.er, isSaving = f.isSaving, form = f.form, mounted = f.mounted, binded = f.binded
  let jsoneditorformDom = null
  let editorform
  $: $form._key = $form._key || '';
  onMount(async () => {
    const { default: JSONEditor } = await import('jsoneditor')
    const options = {
            mode: 'code',
            modes: ["code", "tree"],
          };
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
    <link href="jsoneditor.min.css" rel="stylesheet" type="text/css">
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
