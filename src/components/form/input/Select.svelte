<script>
  import Mindmap from "../../thirdparty/svelte-select/src/Select.svelte"
  let items = [
    {value: 'chocolate', label: 'Chocolate'},
    {value: 'pizza', label: 'Pizza'},
    {value: 'cake', label: 'Cake'},
    {value: 'chips', label: 'Chips'},
    {value: 'ice-cream', label: 'Ice Cream'},
  ];
  
  let selectedValue = undefined;
</script>

<Select {items} bind:selectedValue></Select>