<script>
  import { onMount, onDestroy, createEventDispatcher, S, ws_connected, schemaMutateEvents, Form } from '../modules/functions.js'
  import JSONEditor from 'jsoneditor'
  import { SubmitButton, CancelButton } from '../components/index.js'
  export let key = 0
  const f = new Form(S, key, schemaMutateEvents(key), createEventDispatcher()), er = f.er, isSaving = f.isSaving, form = f.form, mounted = f.mounted, binded = f.binded
  // should make seperate json component
  let jsoneditorformDom = null
  let jsoneditorFieldsDom = null
  let jsoneditorcolumnsDom = null
  let editorform
  let editorFields
  let editorcolumns
  $: $form._key = $form._key || '';
  onMount(async () => {
    const options = {
            mode: 'code',
            modes: ["code", "tree"],
          };
    editorform = new JSONEditor(jsoneditorformDom, options, $form.form || {})
    editorFields = new JSONEditor(jsoneditorFieldsDom, options, $form.columns || {})
    editorcolumns = new JSONEditor(jsoneditorcolumnsDom, options, $form.columns || {})
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
          editorFields.set($form.fields || [])
          editorcolumns.set($form.columns || [])
        }
      }, 1)
      f.bindMutate()
      f.fetch()
      $binded = true
    }
  }
  function onSave() {
    $form.form = editorform.get()
    $form.fields = editorFields.get()
    $form.columns = editorcolumns.get()
    f.onSave()
  }
</script>

<form on:submit|preventDefault={onSave}>
  <label>
    <span>Key</span>
    <input name='key' type="text" bind:value={$form._key} required />
  </label>
  <label>
    <span>Tag</span>
    <input name='tag' type="text" bind:value={$form.tag} />
  </label>
  <label>
    <span>Index</span>
    <input name='index' type="number" bind:value={$form.index} />
  </label>
  <div style="display: flex;">
    <div>
      <div>Form Object:</div>
      <div name='form' bind:this={jsoneditorformDom} style="width: 400px; height: 400px;" />
    </div>
    <div>
      <div>Fields Array:</div>
      <div name='fields' bind:this={jsoneditorFieldsDom} style="width: 400px; height: 400px;" />
    </div>
    <div>
      <div>Columns Array:</div>
      <div name='columns' bind:this={jsoneditorcolumnsDom} style="width: 400px; height: 400px;" />
    </div>
  </div>
  <div>{$er}</div>
  <footer>
    <SubmitButton isSaving={$isSaving} />
    <CancelButton isSaving={$isSaving} {key} on:close />
  </footer>
</form>
