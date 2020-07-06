<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import Label from '../Label.svelte';
  import { css_count } from '../../../css';
  export let name;
  export let value = {};
  export let disabled = false;
  export let error = '';
  import JSONEditor from 'jsoneditor';
  //import 'jsoneditor/dist/jsoneditor.css';
  let jsonediDom = null;
  let jsoneditor;

  css_count.increase('jsoneditor');
  onMount(async () => {
    const options = {
      mode: disabled ? 'view' : 'code',
      modes: ['code', 'tree'],
      onChange: function() {
        try {
          value = jsoneditor.get();
        } catch (err) {
          console.warn('Error in onChange callback: ', err);
        }
      }
    };
    //await import( 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.5/jsoneditor.min.js' );
    //await tick();
    jsoneditor = new JSONEditor(jsonediDom, options, value);
  });
  onDestroy(() => {
    css_count.decrease('jsoneditor');
  });
</script>

<Label {name} />
<div name="form" bind:this={jsonediDom} style="width: 600px; height: 400px; display: inline-block;" />
{#if error}
  <span>{error}</span>
{/if}
