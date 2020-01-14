<script lang='ts'>
	export let name;
	export let required;
	export let disabled;
	export let value;
	export let props = {};
	export let dom = null

	export let options = []
</script>
		<span>{name}</span>
		{#each options as v}
			<input
				 {name}
				 bind:this={dom}
				 type='radio'
				 bind:value={value}
				 {required} 
				 autocomplete={false}
				 {disabled}
				 {...props}
			/>
			<label>{v}</label>
		{/each}