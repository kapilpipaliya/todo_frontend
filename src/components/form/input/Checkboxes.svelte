<script lang='ts'>

	export let name;
	export let required;
	export let disabled;
	export let value;
	export let props;

	$: props.options = props.options ?? [];
</script>

{#each props['options'] as v, i (i)}
	<label>
		<input 
			 name={name}
			 type="checkbox"
			 value={v}
			 bind:group={value}
			 {required}
			 {disabled}
		/>
	 {v}
   </label>
{/each}