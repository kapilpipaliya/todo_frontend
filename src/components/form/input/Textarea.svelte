<script lang='ts'>
	export let name;
	export let required;
	export let disabled;
	export let value;
	export let props = {};
	export let dom = null
</script>
   	  <span>{name}</span>
      <textarea
		bind:value={value}
		bind:this={dom}
		{required}
		{disabled}
        rows={10}
        cols={20}
        {...props}
       />