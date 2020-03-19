<script lang="ts">
  import { onMount, createEventDispatcher, tick } from 'svelte'
  import Editor from '../../../../thirdparty/cl-editor/src/Editor.svelte'
  import Label from '../_Label.svelte'
  export let name
  export let required
  export let disabled
  export let value
  export let props = {}
  export let dom = null
  let cleditorInstance
  // Initialize editor
  onMount(async () => {
    /*	await tick()
	const cleditorInstance = new Editor({
	    // <HTMLElement> required
	    target: cleditorDom,
	    // optional
	    data: {
	        // <Array[string | Object]> string if overwriting, object if customizing/creating
	        // available actions:
	        // 'viewHtml', 'undo', 'redo', 'b', 'i', 'u', 'strike', 'sup', 'sub', 'h1', 'h2', 'p', 'blockquote', 
	        // 'ol', 'ul', 'hr', 'left', 'right', 'center', 'justify', 'a', 'image', 'forecolor', 'backcolor', 'removeFormat'
	        actions: [
	            'b', 'i', 'u', 'strike', 'ul', 'ol',
	            {
	                name: 'copy', // required
	                icon: '<b>C</b>', // string or html string (ex. <svg>...</svg>)
	                title: 'Copy',
	                result: () => {
	                    // copy current selection or whole editor content
	                    const selection = window.getSelection();
	                    if (!selection.toString().length) {
	                        const range = document.createRange();
	                        range.selectNodeContents(cleditorInstance.refs.editor);
	                        selection.removeAllRanges();
	                        selection.addRange(range);
	                    }
	                    cleditorInstance.exec('copy');
	                }
	            },
	            'h1', 'h2', 'p'
	        ],
	        // default 300px
	        height: '300px',
	        // initial html
	        html: value,
	        // remove format action clears formatting, but also removes some html tags.
	        // you can specify which tags you want to be removed.
	        removeFormatTags: ['h1', 'h2', 'blackquote'] // default
	    }
	})
*/
    // Methods
    //cleditorInstance.exec(cmd: string, value?: string) // execute document command (document.executeCommand(cmd, false, value))
    //cleditorInstance.getHtml(sanitize?: boolean) // returns html string from editor. if passed true as argument, html will be sanitized before return
    //cleditorInstance.getText() // returns text string from editor
    //cleditorInstance.setHtml(html: string, sanitize?: boolean) // sets html for editor. if second argument is true, html will be sanitized
    //cleditorInstance.saveRange() // saves current editor cursor position or user selection
    //cleditorInstance.restoreRange() // restores cursor position or user selection
    // saveRange and restoreRange are useful when making custom actions
    // that demands that focus is shifted from editor to, for example, modal window.
  })
  function onChange(event) {
    value = event.detail
  }
</script>

<Label {name} />
<Editor
  bind:this={dom}
  on:change={onChange}
  height="300px"
  html={value}
  removeFormatTags={['h1', 'h2', 'blackquote']} />
