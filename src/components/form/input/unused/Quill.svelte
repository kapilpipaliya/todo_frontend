<script>
	// converted from: view-source:https://quilljs.com/standalone/full/
	import { onMount, onDestroy, tick } from 'svelte'
	
 	export let value = {}
  export let disabled = false
  
  let quilleditorDom = null
  let quilleditor

  onMount(async () => {
    const options = {
			modules: {
				syntax: true,
				toolbar: '#toolbar-container'
			},
			placeholder: '',
			theme: 'snow'
		};
    await import( "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js" );
    const { default: highlight} = await import( "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js" );
    //console.log(highlight)
    //window.hljs = highlight.highlight
    const {default: Quill} = await import( "https://cdn.quilljs.com/1.3.6/quill.min.js" );
    await tick();
    quilleditor = new Quill('#editor-container', options);
    quilleditor.on('text-change', function(delta, oldDelta, source) {
      if (source == 'api') {
        console.log("An API call triggered this change.");
      } else if (source == 'user') {
        console.log("A user action triggered this change.", delta);
      }
    });
  })

</script>

<svelte:head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css" />
<link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
</svelte:head>  

<style>
   #standalone-container {
    margin: 50px auto;
    max-width: 720px;
  }
  #editor-container {
    height: 350px;
  }
</style>

  
<div id="standalone-container">
  <div id="toolbar-container">
    <span class="ql-formats">
      <select class="ql-font"></select>
      <select class="ql-size"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button>
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-direction" value="rtl"></button>
      <select class="ql-align"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
      <button class="ql-formula"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-clean"></button>
    </span>
  </div>
  <div id="editor-container"></div>
</div>
