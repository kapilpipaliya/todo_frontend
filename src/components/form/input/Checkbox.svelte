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
	<input 
		 {name}
		 bind:this={dom}
		 type='checkbox'
		 bind:checked={value}
		 {required} 
		 autocomplete={false}
		 {disabled}
		 {...props}		 
	/>