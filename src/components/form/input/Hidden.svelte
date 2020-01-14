<script lang='ts'>
	export let name;
	export let required;
	export let disabled;
	export let value;
	export let props = {};
</script>
	<input 
		 {name}
		 type='hidden'
		 bind:value={value}
		 {required} 
		 autocomplete={false}
		 {disabled}
		 {...props}
	/>