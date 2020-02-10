<script lang='ts'>
	let columns = []
	let fields = []
	function onNewColumnClick(){
		const o = {
      "calculated": "",
      "prefix": "",
      "selector": "_key",
      "label": "Key",
      "type": "text",
      "visible_type": "text"
    }
		columns.push(o)
		columns = columns
	}
	function onResetColumnClick(){
		columns = []
	}
	function onNewFieldClick(){
		const o = {
    "default_value": "",
    "description": "",
    "disabled": false,
    "selector": "",
    "label": "",
    "props": {},
    "required": false,
    "type": "text"
  }
		fields.push(o)
		fields = fields
	}
	function onResetFieldClick(){
		fields = []
	}
	let types = [
		'color','email','file', 'hidden', 'number', 'password', 'text', 'checkbox', 'textarea', 'select', 'radio'
	]

</script>

<div>
	Columns:
	<br>
	Enter selector, label, type, visible_type
</div>
{#each columns as c, index}
<div style='display: flex'>
	<input bind:value={c.selector} on:change={()=>{c.label = c.selector; columns=columns}}/>
	<input bind:value={c.label}>
	<select bind:value={c.type} >
			{#each types as t}
				<option>{t}</option>
			{/each}
	</select>
		<select bind:value={c.visible_type} >
			{#each types as t}
				<option>{t}</option>
			{/each}
	</select>
	</div>
{/each}
<button on:click={onNewColumnClick}> Add </button>
<button on:click={onResetColumnClick}> Reset </button>
<pre>
{JSON.stringify(columns)}
</pre>


<div>
	Fields:
	<br>
	Enter key, label, type, 	required, disabled, description, default_value
</div>
{#each fields as c, index}
<div>
	<input bind:value={c.selector} on:change={()=>{c.label = c.selector; fields=fields}}/>
	<input bind:value={c.label}>
	<select bind:value={c.type}>
			{#each types as t}
				<option>{t}</option>
			{/each}
	</select>
	<input type='checkbox' bind:checked={c.required}>
	<input type='checkbox' bind:checked={c.disabled}>
	<input bind:value={c.description}>
	<input bind:value={c.default_value}>
	</div>
{/each}
<button on:click={onNewFieldClick}> Add </button>
<button on:click={onResetFieldClick}> Reset </button>
<pre>
{JSON.stringify(fields)}
</pre>