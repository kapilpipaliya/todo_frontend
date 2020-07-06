<script lang="ts">
  /**
   *
   * \todo Implement drag and drop from: Svelte-File-Upload-Component
   * https://github.com/vipero07/svelte-file-upload-component
   */

  import Label from '../Label.svelte';
  export let name;
  export let required;
  export let disabled;
  export let value;
  export let props = {};
  export let dom = null;
  export let error = '';
  let er = '';
  let progressBar;
  let percentageDiv;

  let xhr;
  let ot = 0;
  let oloaded = 0;
  //File uploading method
  function UpladFile() {
    const fileObj = dom.files[0]; // js get file object
    const url = 'http://localhost:8500' + '/api/attachment/upload';

    let form = new FormData(); // FormData object
    form.append('file', fileObj); // File object

    xhr = new XMLHttpRequest(); // XMLHttpRequest object
    xhr.open('post', url, true); //post
    xhr.onload = uploadComplete;
    xhr.onerror = uploadFailed;

    xhr.upload.onprogress = progressFunction;
    xhr.upload.onloadstart = function() {
      ot = new Date().getTime();
      oloaded = 0;
    };

    xhr.send(form);
  }

  function uploadComplete(evt) {
    if (evt.target.responseText) {
      const data = JSON.parse(evt.target.responseText);
      if (data[0]) {
        alert('Uploaded successfully!');
        value = data[1];
      } else {
        er = 'Upload failed!';
      }
    } else {
      er = 'Upload failed: ' + evt.target.statusText;
    }
  }

  function uploadFailed(evt) {
    er = 'Upload failed!';
  }
  function cancleUploadFile() {
    xhr.abort();
  }
  function progressFunction(evt) {
    if (evt.lengthComputable) {
      //
      progressBar.max = evt.total;
      progressBar.value = evt.loaded;
      percentageDiv.innerHTML = Math.round((evt.loaded / evt.total) * 100) + '%';
    }
    let time = document.getElementById('time');
    let nt = new Date().getTime();
    let pertime = (nt - ot) / 1000;
    ot = new Date().getTime();
    let perload = evt.loaded - oloaded;
    oloaded = evt.loaded;
    let speed = perload / pertime;
    let bspeed = speed;
    let units = 'b/s';
    if (speed / 1024 > 1) {
      speed = speed / 1024;
      units = 'k/s';
    }
    if (speed / 1024 > 1) {
      speed = speed / 1024;
      units = 'M/s';
    }
    speed = speed.toFixed(1);
    let resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
    time.innerHTML = ',Speed: ' + speed + units + ', the remaining time: ' + resttime + 's';
    if (bspeed == 0) time.innerHTML = 'Upload cancelled';
  }
</script>

<Label {name} />
<progress bind:this={progressBar} value="0" max="100" style="width: 300px;" />
<span bind:this={percentageDiv} />
<span id="time" />
<input {name} bind:this={dom} type="file" bind:value {required} autocomplete={false} {disabled} {...props} />
<input type="button" on:click={UpladFile} value="Upload" />
<input type="button" on:click={cancleUploadFile} value="Cancel" />
{#if error}
  <span>{error}</span>
{/if}
