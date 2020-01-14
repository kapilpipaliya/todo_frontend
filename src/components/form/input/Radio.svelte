<script lang='ts'>
	export let name;
	export let required;
	export let disabled;
	export let value;
	export let props = {};
</script>
		<span>{name}</span>
		{#each f as v}
			<input
				 {name}
				 type='radio'
				 bind:value={value}
				 {required} 
				 autocomplete={false}
				 {disabled}
				 {...props}
			/>
			<label>{v}</label>
		{/each}