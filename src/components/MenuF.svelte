<script>
export let menu = {}
</script>
<div>
{#if menu.title}
{menu.title}:
{/if}
<br>
{#if menu.tabs}
{#each menu.tabs as tab}
	{#each tab.columns as c}
			{#each c as u}
				<a href={u.url}>{u.title}</a>{' '}
			{/each}
	{/each}
{/each}
{/if}
</div>