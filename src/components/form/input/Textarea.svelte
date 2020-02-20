<script lang='ts'>
	import Label from '../_Label.svelte'
	export let name;
	export let required;
	export let disabled;
	export let value;
	export let props = {};
	export let dom = null
</script>
<Label {name} />
<textarea
	bind:value={value}
	bind:this={dom}
	{required}
	{disabled}
	rows={5}
	cols={20}
	{...props}
/>