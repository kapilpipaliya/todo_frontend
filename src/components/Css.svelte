<script>
	import { css, css_frameworks, selected_frameworks } from '../modules/global_stores/css.js'
</script>


<svelte:head>
{#each Object.entries($css_frameworks) as [framework, link], index (framework)}
	{#each $selected_frameworks as f, index (f)}
		{#if framework == f}
			{@html link}
		{/if}
	{/each}
{/each}


{#each Object.entries($css) as [key, comp], index (key)}
		{#if comp.css.count}
			{#each comp.css.links as l, index (l)}
				<link rel="stylesheet" href="{l}">
			{/each}
		{/if}
{/each}

</svelte:head>
