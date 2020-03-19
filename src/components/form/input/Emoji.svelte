<script>
	import EmojiSelector from "../../../../thirdparty/svelte-emoji-selector/src/index.svelte";
	export let value = '';
	function onEmoji(event) {value += event.detail; }
	 // update the same authors https://github.com/joeattardi/emoji-button library
   // note emoji.js = 247 kb
</script>
<input bind:value={value} type="text">
<EmojiSelector on:emoji={onEmoji} />