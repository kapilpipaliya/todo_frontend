<script lang="ts">
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
    }
    await import(
      'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js'
    )
    const { default: highlight } = await import(
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'
    )
    //console.log(highlight)
    //window.hljs = highlight.highlight
    const { default: Quill } = await import(
      'https://cdn.quilljs.com/1.3.6/quill.min.js'
    )
    await tick()
    quilleditor = new Quill('#editor-container', options)
    quilleditor.on('text-change', function(delta, oldDelta, source) {
      if (source == 'api') {
        console.log('An API call triggered this change.')
      } else if (source == 'user') {
        console.log('A user action triggered this change.', delta)
      }
    })
  })
</script>

<style>
  #standalone-container {
    margin: 50px auto;
    max-width: 720px;
  }
  #editor-container {
    height: 350px;
  }
</style>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css" />
  <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
</svelte:head>

<div id="standalone-container">
  <div id="toolbar-container">
    <span class="ql-formats">
      <select class="ql-font" />
      <select class="ql-size" />
    </span>
    <span class="ql-formats">
      <button class="ql-bold" />
      <button class="ql-italic" />
      <button class="ql-underline" />
      <button class="ql-strike" />
    </span>
    <span class="ql-formats">
      <select class="ql-color" />
      <select class="ql-background" />
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub" />
      <button class="ql-script" value="super" />
    </span>
    <span class="ql-formats">
      <button class="ql-header" value="1" />
      <button class="ql-header" value="2" />
      <button class="ql-blockquote" />
      <button class="ql-code-block" />
    </span>
    <span class="ql-formats">
      <button class="ql-list" value="ordered" />
      <button class="ql-list" value="bullet" />
      <button class="ql-indent" value="-1" />
      <button class="ql-indent" value="+1" />
    </span>
    <span class="ql-formats">
      <button class="ql-direction" value="rtl" />
      <select class="ql-align" />
    </span>
    <span class="ql-formats">
      <button class="ql-link" />
      <button class="ql-image" />
      <button class="ql-video" />
      <button class="ql-formula" />
    </span>
    <span class="ql-formats">
      <button class="ql-clean" />
    </span>
  </div>
  <div id="editor-container" />
</div>
