<script>
	import { css, css_frameworks, selected_frameworks, css_count } from '../../modules/global_stores/css'
/* No Framework load
{#each Object.entries($css_frameworks) as [framework, link], index (framework)}
	{#each $selected_frameworks as f, index (f)}
		{#if framework == f}
			{@html link}
		{/if}
	{/each}
{/each}
*/

</script>


<svelte:head>



{#each Object.entries($css) as [key, comp], index (key)}
		{#if $css_count[key]}
			
				<link rel="stylesheet" href="{comp.link}">
			
		{/if}
{/each}

</svelte:head>
