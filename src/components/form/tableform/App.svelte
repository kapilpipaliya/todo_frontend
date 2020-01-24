
<script lang='ts'>
	//import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications'
	//let n
	
	import TableForm from './TableForm.svelte'
	let data = [[1,2,3], [4,5,6], [7,8,9], [10,11,12]];
	let values = [1,10]
	
	let dp= "r[1]+' '+r[2]";
	let keyIdx= 0
	
</script>

<TableForm bind:data={data} {dp} {keyIdx} {values} />
