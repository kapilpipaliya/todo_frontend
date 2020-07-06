<script lang="ts">
  import Dropzone from '../../../utils/svelte-dropzone/index.svelte';
  import Label from '../Label.svelte';
  export let name;
  export let error = '';
  const addedfile = file => console.log(file);
  const drop = event => console.log(event.target);
  const init = () => 0;
</script>

<Label {name} />
<Dropzone
  dropzoneClass="dropzone"
  hooveringClass="dropzone-hoovering"
  id="id"
  dropzoneEvents={{ addedfile, drop, init }}
  options={{ clickable: true, acceptedFiles: 'text/javascript', maxFilesize: 256, init }}>
  <p>Drop files here to upload</p>
</Dropzone>
{#if error}
  <span>{error}</span>
{/if}
