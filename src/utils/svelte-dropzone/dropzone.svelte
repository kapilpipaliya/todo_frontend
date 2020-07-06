<script lang="js">
  import { onMount, onDestroy } from 'svelte';
  import Dropzone from 'dropzone';
  export let dropzoneEvents = {};
  export let options = { previewTemplate: '<div/>' };
  export let dropzoneClass = 'dropzone';
  export let hooveringClass = 'dropzone-hoovering';
  export let id = 'dropId';
  export let autoDiscover = false;
  import { css_count } from '../../css';

  css_count.increase('dropzone');
  onMount(async () => {
    const dropzoneElement = document.getElementById(id);
    if (!options.previewTemplate) {
      options.previewTemplate = '<div/>';
    }
    if (!options.dictDefaultMessage) {
      options.dictDefaultMessage = '';
    }

    let svDropzone = new Dropzone(`div#${id}`, {
      ...options
    });
    if (autoDiscover !== true) {
      Dropzone.autoDiscover = false;
    }

    svDropzone.on('addedfile', f => {
      dropzoneElement.classList.remove(hooveringClass);
    });
    svDropzone.on('dragenter', e => {
      console.log(dropzoneElement);
      dropzoneElement.classList.toggle(hooveringClass);
    });
    svDropzone.on('dragleave', e => {
      dropzoneElement.classList.toggle(hooveringClass);
    });
    Object.entries(dropzoneEvents).map(([eventKey, eventFunc]) => svDropzone.on(eventKey, eventFunc));

    if (options.clickable !== false) {
      dropzoneElement.style.cursor = 'pointer';
    }
    svDropzone.on('error', (file, errorMessage) => {
      console.log(`Error: ${errorMessage}`);
    });
  });
  onDestroy(() => {
    css_count.decrease('dropzone');
  });
</script>

<div action="#" class={dropzoneClass} {id}>
  <slot />
  <input hidden name="sites_data" type="file" />
</div>
