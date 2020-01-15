<script lang='ts'>
	export let name;
	export let required;
	export let disabled;
	export let value;
	export let props = {};
	export let dom = null
</script>
	<span>{name}</span>
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