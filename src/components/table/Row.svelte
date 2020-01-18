<script lang='ts'>
  import { DisplayType } from '../../modules/functions.ts'
  import { css } from '../../modules/global_stores/css.ts'
  import {project_id} from '../../modules/global_stores/project.ts'
  import UrlPattern from 'url-pattern'
  
  export let selected: boolean
  export let showRowNum
  export let rowNum
  export let isGlobal
  export let rowValue
  export let headerIsvisibleColumnsRow= []
  export let headerVisibleColTypesRow = []
  export let headerColumnPropsRow = []
  export let selectedRowsKeys = []
  export let onSelectRowClick
  export let onItemClick
  export let onDeleteClick
  export let onDeleteRow
  export let quickview = []
  export let showQuickView
  export let quickcomponent
  export let schema_key
  export let eventsFn
  export let onCancel
  export let successSave
  export let deleteRow
  export let getValue

  function makeUrl(props, id){
    return new UrlPattern(props.pattern).stringify({id, org: $project_id[0], project: $project_id[1]})
  }
</script>

        <tr class="{selected ? $css.table.class.selected || 'selected' : ''}" >
          {#if showRowNum}
            <td>{rowNum}</td>
          {/if}
          <td>
              {#if !isGlobal}
                {#if false}
                  <span>ID: {getValue(rowValue[0])}</span>
                {/if}
                <input
                  type="checkbox"
                  value={getValue(rowValue[0])}
                  checked={selectedRowsKeys.includes(getValue(rowValue[0]))}
                  on:click={onSelectRowClick} />
              {/if}
          </td>
          <td>
              {#if !isGlobal}
              {#if quickcomponent && !quickview.includes(getValue(rowValue[0]))}
                <button
                  name='edit'
                  key={getValue(rowValue[0])}
                  type="button"
                  on:click={() => {
                    quickview.push(getValue(rowValue[0]))
                    quickview = quickview
                  }}>
                  Edit
                </button>
              {/if}
              {/if}
          </td>
          <td>
              {#if !isGlobal}
              <button name='delete' key={getValue(rowValue[0])} type="button" on:click={onDeleteRow(getValue(rowValue[0]))}>D</button>
              {/if}
          </td>
          {#each rowValue as c, index}
            {#if headerIsvisibleColumnsRow[index]}
              <td>
                {#if c != null}
                  {#if headerVisibleColTypesRow[index] === DisplayType.UTCTIME}
                    {new Date(c).toLocaleString()}
                  {:else if headerVisibleColTypesRow[index] === DisplayType.URL}
                    <a href={makeUrl(headerColumnPropsRow[index], c)}>{headerColumnPropsRow[index].label}</a>
                  {:else}{getValue(c)}{/if}
                {/if}
              </td>
            {/if}
          {/each}
          <!-- <td> -->
          {#if false}
            <a href="javascript:;" on:click={() => onItemClick(rowValue)}>
              <span class="icon is-small">
                <i class="fas fa-edit" />
                edit
              </span>
            </a>

            <a href="javascript:;" on:click={() => onDeleteClick(rowValue)}>
              <span class="icon is-small">
                <i class="fas fa-trash" />
                delete
              </span>
            </a>
          {/if}
          <!-- </td> -->
        </tr>
        {#if showQuickView}
          <tr>
            <td colspan={rowValue.length + 3}>
              {#if quickcomponent}
                <svelte:component
                  this={quickcomponent}
                  key={getValue(rowValue[0])}
                  {schema_key}
                  {eventsFn}
                  on:close={onCancel}
                  on:successSave={successSave}
                  on:deleteRow={deleteRow} />
              {/if}
            </td>
          </tr>
        {/if}