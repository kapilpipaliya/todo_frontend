<script lang='ts'>
	//export let name;
	export let href;
	export let value;
	export let props = {};
	//export let dom = null
</script>
{#if href}
<a href={href} {...props}>{value}</a>
{/if}