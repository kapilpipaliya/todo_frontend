<script>
   // import the core component
  import ProsemirrorEditor from "../../thirdparty/prosemirror-svelte/ProsemirrorEditor.svelte";

  // import helpers to work with prosemirror state
  import { createSingleLineEditor, toPlainText } from '../../thirdparty/prosemirror-svelte/state';  

  // create the initial editor state
  let editorState = createSingleLineEditor('Hello world!'); 

  function handleChange(event) {
    // get the new editor state from event.detail
    editorState = event.detail.editorState;
  }

  // log the text content of the editor state, just for fun
  $: console.log(toPlainText(editorState)); 

</script>

<ProsemirrorEditor 
  placeholder="Go ahead and type something" 
  {editorState} 
  on:change={handleChange}
/>