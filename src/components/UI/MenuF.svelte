<script>
import * as R from 'ramda'
export let menu = {}
const h = R.compose(R.length, R.filter(x=>!x.hidden) )
$: tabsCount = h(menu.tabs);
</script>

{#if menu.tabs}
<div>
{#each menu.tabs as tab}
	{#if tabsCount > 1}&nbsp&nbsp{tab.title}:{/if}
	<div>
	{#each tab.columns as c}
			{#if !tab.hidden}
			&nbsp&nbsp
			{#each c as u}
				<a href={u.url}>{u.title}</a>{' '}
			{/each}
			{/if}
	{/each}
	</div>
{/each}
</div>
{/if}
