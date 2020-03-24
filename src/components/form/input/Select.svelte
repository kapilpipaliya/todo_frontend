<script lang="ts">
  import Select from '../../../../thirdparty/svelte-select/src/Select.svelte'
  import Label from '../Label.svelte'
  export let name
  let items = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'pizza', label: 'Pizza' },
    { value: 'cake', label: 'Cake' },
    { value: 'chips', label: 'Chips' },
    { value: 'ice-cream', label: 'Ice Cream' }
  ]

  let selectedValue = undefined
</script>

<Label {name} />
<Select {items} bind:selectedValue />
