<script lang='ts'>
	export let name;
	export let required;
	export let disabled;
	export let value;
	export let props = {};
</script>
   	  <span>{name}</span>
      <textarea
		bind:value={value}
		{required}
		{disabled}
        rows={10}
        cols={20}
        {...props}
       />