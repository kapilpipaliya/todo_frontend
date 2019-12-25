<script>
import * as R from 'ramda'
export let menu = {}
</script>
<ul>
{#each menu as m}
	{#if !m.hidden}
		<li><a href={m.path}>{m.name}</a></li>
	{/if}
	{#if m.children}
		<svelte:self menu={m.children}/>
	{/if}
{/each}
</ul>
