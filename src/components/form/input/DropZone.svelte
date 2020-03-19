<script lang='ts'>
  import Dropzone from "../../../../thirdparty/svelte-dropzone/index.svelte";
  const addedfile = file => console.log(file);
  const drop = event => console.log(event.target);
  const init = () => 0;
</script>
<Dropzone
  dropzoneClass="dropzone"
  hooveringClass="dropzone-hoovering"
  id="id"
  dropzoneEvents={{ addedfile, drop, init }}
  options={{ clickable: true, acceptedFiles: 'text/javascript', maxFilesize: 256, init }}>
  <p>Drop files here to upload</p>
</Dropzone>