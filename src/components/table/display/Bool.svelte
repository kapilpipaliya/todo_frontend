<script lang='ts'>
	//export let name;
	export let value;
	export let props = {};
	//export let dom = null
</script>

<span {...props} ><input type='checkbox' checked={!!value} disabled={true} /></span>