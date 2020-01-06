<script lang='ts'>
	import Form from './Form.svelte'
	let form = [[1,2], 2]
	let headers = ["Number1", "Number2"]
	let types = ["checkbox", "text"]
	let required = [true, false]
	let placeholder = ["A", "B"]
	let disabled = [false, false]
	let readonly = [false, false]
	let title = ['Enter 1', 'Enter 2']
	let tabindex = [1, 1]
	let style = ['color:green;', '']
	let classe = ['my', '']
	let description = ['description1', 'description2']
	let props = [{options:[1,2,3]}, {}]
	$: {
		console.log(form[0])
	}
</script>

<Form
	bind:form
	{headers}
	{types}
	{required}
	{placeholder}
	{disabled}
	{readonly}
	{title}
	{tabindex}
	{style}
	{classe}
	{description}
	{props}
/>
