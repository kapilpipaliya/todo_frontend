<script lang="ts">
  import { onMount } from 'svelte';
  import { Debug } from '../../UI/debug';
  import Label from '../Label.svelte';
  export let name;
  export let value = [];
  export let disabled = false;
  export let ar = false;
  value = value ?? [];
  let doms = [];
  function handleAdd() {
    value.push('');
    value = value;
    setTimeout(function() {
      if (doms[value.length - 1]) doms[value.length - 1].focus();
    }, 50);

    //const itemSchema = (isFixedItems(schema) && allowAdditionalItems(schema)) ? schema.allowAdditionalItems : schema.items
    //formData = [...formData, getDefaultFormState(itemSchema, undefined, definitions)]
  }
  const handleDelete = row => e => {
    e.stopPropagation();
    value = value.filter((_, i) => i !== row);
  };
  const onReorder = (from, to) => event => {
    event.stopPropagation();

    value = value.map((item, i, array) =>
      i === from ? array[to] : i === to ? array[from] : item
    );
  };
</script>

<Debug title="Array" data={{ $$props }} />
<Label {name} />
<table>
  <tbody>
    {#each value as v, i (i)}
      <tr>
        {#if false}
          <td>
            <label />
          </td>
        {/if}
        <td>
          <input
            type="text"
            bind:value={v}
            bind:this={doms[i]}
            required
            {disabled} />
        </td>
        {#if ar}
          <td>
            <button
              type="button"
              on:click={onReorder(i, i - 1)}
              disabled={disabled || i == 0}>
              ˄
            </button>
          </td>
          <td>
            <button
              type="button"
              on:click={onReorder(i, i + 1)}
              disabled={disabled || i == value.length - 1}>
              ˅
            </button>
          </td>
        {/if}
        <td>
          <button type="button" on:click={handleDelete(i)} {disabled}>x</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<button type="button" on:click={handleAdd} {disabled}>Add</button>
