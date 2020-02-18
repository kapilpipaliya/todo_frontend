<script>
	// https://gomakethings.com/how-to-truncate-text-with-vanilla-javascript/
	// oh there is also : https://www.npmjs.com/package/smart-truncate
	export let value=''
	let elem
	
	function truncate (elem, limit, after) {
		// Make sure an element and number of items to truncate is provided
		if (!elem || !limit) return;

		// Get the inner content of the element
		let content = elem.textContent.trim();

		// Convert the content into an array of words
		// Remove any words above the limit
		content = content.split(' ').slice(0, limit);

		// Convert the array of words back into a string
		// If there's content to add after it, add it
		value = content.join(' ') + (after ? after : '');

		// Inject the content back into the DOM
		//elem.textContent = content;
};
//var elem = document.querySelector('.truncate');
$: value && elem && truncate(elem, 7, '...');
</script>


<div bind:this={elem} class="truncate">
	{value}
</div>