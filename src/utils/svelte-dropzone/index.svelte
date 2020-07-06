<script lang="js">
  import { onMount } from 'svelte';
  import DROPZONESSR from './dropzone.svelte';
  export let dropzoneEvents = {};
  export let options = { previewTemplate: '<div/>' };
  export let dropzoneClass = 'dropzone';
  export let hooveringClass = 'dropzone-hoovering';
  export let id = 'dropId';
  export let autoDiscover = false;

  //let DROPZONESSR;

  onMount(async () => {
    //const dropzone = await import("./dropzone.svelte");
    //DROPZONESSR = dropzone.default;
  });
</script>

<svelte:component this={DROPZONESSR} {dropzoneEvents} {options} {dropzoneClass} {hooveringClass} {id}>
  <slot>
    <p class="dropzone-default">drop your file(s) here or click to add file</p>
  </slot>
</svelte:component>
