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
	&nbsp&nbsp
	<div>
	{#each tab.columns as c}
			&nbsp&nbsp
			{#each c as u}
				<a href={u.url}>{u.title}</a>{' '}
			{/each}
	{/each}
	</div>
{/each}
{/if}
</div>