<script lang='ts'>
	export let name;
	export let required;
	export let disabled;
	export let value;
	export let props = {};
</script>
	<span>{name}</span>
	<input 
		 {name}
		 type='email'
		 bind:value={value}
		 {required} 
		 autocomplete={false}
		 {disabled}
		 {...props}
	/>