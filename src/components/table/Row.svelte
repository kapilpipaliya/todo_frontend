<script lang='ts'>
  import { DisplayType, getContext, get } from '../../modules/index'
  import { css } from '../../modules/global_stores/css'
  import UrlPattern from 'url-pattern'

  import Text from './display/Text.svelte'
  import Bool from './display/Bool.svelte'
  import Url from './display/Url.svelte'
  import Color from './display/Color.svelte'

  import GeneralForm from '../form/Index.svelte'
  import {FormType} from '../../modules/enums'
  
  export let selected: boolean
  export let showRowNum
  export let rowIndex
  export let isGlobal
  export let rowValue
  export let headerIsvisibleColumnsRow= []
  export let headerVisibleColTypesRow = []
  export let editableColumnsRow = []
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
  export let onCancel
  export let successSave
  export let deleteRow
  export let getValue
  export let fetchConfig
  export let rowEditDoms
  export let rowDoms

  const org_id_ctx = getContext('org_id')
  const org_id = org_id_ctx ? get(org_id_ctx) : ''

  const project_id_ctx = getContext('project_id')
  const project_id = project_id_ctx ? get(project_id_ctx) : ''


  function makeUrl(props, id){
    return new UrlPattern(props.dp).stringify({id, org: org_id, project: project_id})
  }
</script>

        <tr bind:this={rowDoms[rowIndex]} class="{selected ? $css.table.classes.selected || 'selected' : ''}" >
          {#if showRowNum}
            <td>{rowIndex + 1}</td>
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
              <button name='delete' key={getValue(rowValue[0])} type="button" on:click={e=>onDeleteRow(getValue(rowValue[0]), rowIndex)()}>D</button>
              {/if}
          </td>
          {#each rowValue as c, index}
            {#if headerIsvisibleColumnsRow[index]}
              <td>
                {#if editableColumnsRow[index]}
                  <GeneralForm
                  {schema_key}
                  key={getValue(rowValue[0])}
                  {fetchConfig}
                  selector={["_key", editableColumnsRow[index].s]}
                  headerSchema={[
                    [
                      [
                        [
                          [],
                          [FormType.hidden, editableColumnsRow[index].t],
                          [],
                          [],
                          [],
                          {}
                        ],
                        {}
                      ],
                      {r: {result:[[getValue(rowValue[0]), getValue(c)]]}  } 
                    ]
                  ]
                  }
                  />
                {:else if c != null}
                  {#if headerVisibleColTypesRow[index] === DisplayType.DateTime}
                    {new Date(c).toLocaleString()}
                  {:else if headerVisibleColTypesRow[index] === DisplayType.Url}
                    <Url href={makeUrl(headerColumnPropsRow[index], c)} value={headerColumnPropsRow[index].l}/>
                  {:else if headerVisibleColTypesRow[index] === DisplayType.Checkbox}
                    <Bool value={getValue(c)}/>
                  {:else if headerVisibleColTypesRow[index] === DisplayType.Color}
                    <Color value={getValue(c)}/>
                  {:else}
                    <Text value={getValue(c)}/>
                  {/if}
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
                  bind:this={rowEditDoms[rowIndex]}
                  key={getValue(rowValue[0])}
                  {schema_key}
                  {fetchConfig}
                  on:close={onCancel}
                  on:successSave={successSave}
                  on:deleteRow={deleteRow} />
              {/if}
            </td>
          </tr>
        {/if}