<script lang='ts'>
	//export let name;
	export let value;
	export let props = {};
	//export let dom = null
	$: {
		const t = new Date(value)
		value = t.toLocaleString()
	}
</script>

<span {...props} ><input type='checkbox' checked={!!value} disabled={true} /></span>