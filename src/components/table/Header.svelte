<script lang='ts'>
  import { DisplayType } from '../../modules/index'
  import { css } from '../../modules/global_stores/css'
  export let mergeRowsCount
  export let allSelected
  export let onSelectAllClick
  export let headerTitlesRow
  //export let selected: boolean
  export let headerIsvisibleColumnsRow= []
  export let headerVisibleColTypesRow = []
  export let sortSettingsRow = []
  export let customFilter = []
  export let filterSettings = []
  export let hiddenColumns = []
  export let onHeaderContext
  export let onHandleFilter
  export let onTextInputContext
  export let onHandleSort
  export let showRowNum
  export let rowDoms
  export let items
  let rowNumScroll
  let scrolledRow
  function removeScrollFocus(){
    if(scrolledRow){
      scrolledRow.classList.remove("onScrollFocus")
    }
  }
  function onRowNumChange() {
    removeScrollFocus()
    scrolledRow = rowDoms[rowNumScroll-1]
    if(scrolledRow){
      const offsetTop = scrolledRow.offsetTop
      window.scrollTo(0, offsetTop)
      scrolledRow.classList.add("onScrollFocus")
      setTimeout(removeScrollFocus, 1500);
    }
  }
</script>
<tr>
  <th colspan={mergeRowsCount}>
    <input
      type="checkbox"
      bind:checked={allSelected}
      on:click={onSelectAllClick} />
    Actions
  </th>
  {#each headerTitlesRow as h, index}
    {#if headerIsvisibleColumnsRow[index]}
      <th
        on:click={e => onHandleSort(e, index)}
        on:contextmenu|preventDefault={e => onHeaderContext(e, index)}>
        {h}
        {#if sortSettingsRow[index] === 0}
          ▲
        {:else if sortSettingsRow[index] === 1}
          ▼
        {:else}
          <!-- content here -->
        {/if}
      </th>
    {/if}
  {/each}
  <!-- <th width="100px">Actions</th> -->
</tr>
<tr>
  {#if showRowNum} <th><input type="number" class="w60" bind:value={rowNumScroll} min="1" max={items.length} on:change={onRowNumChange}/></th> {/if}
  <th colspan={mergeRowsCount - (showRowNum ? 1 : 0)} />
  {#each headerTitlesRow as h, index}
    {#if headerIsvisibleColumnsRow[index]}
      {#if customFilter[index]}
        <th> <select bind:value={filterSettings[index]} on:change={onHandleFilter(index)}>
            {#each customFilter[index] as f} <option value={f[1]}>{f[0]}</option> {/each}
          </select> </th>
      {:else if !hiddenColumns.includes(headerVisibleColTypesRow[index])}
        {#if headerVisibleColTypesRow[index] === DisplayType.Number || headerVisibleColTypesRow[index] === DisplayType.Text || headerVisibleColTypesRow[index] === DisplayType.Double}
          <th>
            <input
              type="search"
              placeholder=" &#128269;"
              bind:value={filterSettings[index]}
              on:input={onHandleFilter(index)}
              on:contextmenu|preventDefault={e => onTextInputContext(e, index)} >
          </th>
        {:else if headerVisibleColTypesRow[index] === DisplayType.Checkbox}
          <th>
            <input
              type="checkbox"
              bind:checked={filterSettings[index]}
              on:change={onHandleFilter(index)}
              on:contextmenu|preventDefault={e => onTextInputContext(e, index)} >
          </th>
        {:else if headerVisibleColTypesRow[index] === DisplayType.DateTime}
          <th>Date</th>
        {:else if headerVisibleColTypesRow[index] === DisplayType.Url}
          <th></th>
        {:else if headerVisibleColTypesRow[index] === DisplayType.Color}
          <th></th>
        {:else}
          <th>Unknown Type {headerVisibleColTypesRow[index]}</th>
        {/if}
      {:else}
        <th />
      {/if}
    {/if}
  {/each}
  <!-- <th width="100px"></th> -->
</tr>