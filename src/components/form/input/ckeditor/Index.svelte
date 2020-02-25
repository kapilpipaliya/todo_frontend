
<script lang='ts'>
  // https://github.com/techlab23/ckeditor5-svelte/blob/master/sample/src/App.svelte
  import { onMount } from 'svelte'
  import CKEditor from "./CKEditor.svelte"
  
  let editorData = "<b>Hello World</b>"
  
  let editor
  let editorInstance = null  

  let loading = true;
  
  onMount(async()=> {
    const {default: e} = await import('@ckeditor/ckeditor5-build-decoupled-document')
    //const {default: e} = await import('@ckeditor/ckeditor5-build-classic')
    editor = e
    loading = false;
  })
  
  // If needed, custom editor config can be passed through to the component 
  // Uncomment the custom editor config if you need to customise the editor.
  let editorConfig = {
    // toolbar: {
    //   items: [
    //     'heading',
    //     "|",
    //     "fontFamily",
    //     "fontSize",
    //     "bold",
    //     "italic",
    //     "underline"
    //   ]
    // }
  }
  function onReady( { detail: editor } )  {
    // Insert the toolbar before the editable area.
    editorInstance = editor
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    )
  }
</script>

{#if !loading}
  <div>
    <CKEditor bind:editor={editor} on:ready={onReady} bind:value={editorData} bind:config={editorConfig}></CKEditor>
  </div>
  <div style="margin-top:40px; margin-left:10px">
    <h4>HTML Output</h4>
    {editorData}
  </div>
{/if}
