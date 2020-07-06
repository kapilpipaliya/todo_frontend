<script lang="ts">
  import EmojiSelector from '../../../utils/svelte-emoji-selector/src/index.svelte';
  export let value = '';
  export let error = '';

  function onEmoji(event) {
    value += event.detail;
  }
  // update the same authors https://github.com/joeattardi/emoji-button library
  // note emoji.js = 247 kb
</script>

<input bind:value type="text" />
<EmojiSelector on:emoji={onEmoji} />
{#if error}
  <span>{error}</span>
{/if}
