<script lang='ts'>
	import Flatpickr from './FlatpickerInput.svelte'
	export let value = null
	export let disabled

	//import 'flatpickr/dist/flatpickr.css'
	//import 'flatpickr/dist/themes/light.css'
	
	const flatpickrOptions = {
		enableTime: true,
		onChange: (selectedDates, dateStr, instance) => {
			console.log('Options onChange handler', selectedDates, dateStr, instance)
		}
	}

	function handleChange(customEvent) {
		// console.log('Svelte onChange handler', customEvent) // customEvent.detail is same as above function
	}
	//placeholder=""
	//on:change={handleChange}
</script>

	<Flatpickr
		options={flatpickrOptions }
		bind:value={value}
		{disabled}
		/>

