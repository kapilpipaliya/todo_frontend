<script lang='ts'>
	export let value;
	export let props = {};
</script>

<span {...props} ><input type='checkbox' checked={!!value} disabled={true} ></span>