<script>
	import { onMount } from 'svelte';
	import clsx from "clsx";

	export let name;
	export let required;
	export let disabled;
	export let readonly;
	export let title;
	export let tabindex;
	export let style;
	export let classe;
	export let value;
	export let props;
	

	
</script>

{#each props['options'] as v, i (i)}
	<label>
			<input 
					 name={name}
					 type="checkbox"
					 value={v}
					 bind:group={value}
					 {required}
					 disabled={disabled}
					 readonly={readonly}
					 title={title}
					 tabindex={tabindex}
					 style={style} 
					 class={clsx(classe)}
					 
				/>
		 {v}
   </label>
{/each}