<script context="module">
  import Column from './Column.svelte'
  import Space from './Space.svelte'
</script>

<script lang="ts">
  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    getContext,
    tick
  } from 'svelte'
  import { view, lensPath, all, equals } from 'ramda'
  import { isArray } from 'ramda-adjunct'
  import { get, writable } from 'svelte/store'
  import { S, ws_connected } from '../../../ws_events_dispatcher'
  import {
    IS_PRODUCTION,
    ET,
    E,
    schemaEvents,
    SortDirection,
    ValueType,
    FormType,
    DisplayType
  } from '../../../enums'
  declare let $ws_connected
  import { translation } from '../../../translation'
  declare let $translation
  import Modal from '../../UI/Model.svelte'
  import Error from '../../UI/Error.svelte'
  import Skeleton from '../../UI/Skeleton.svelte'
  import { css_loading, css, css_count } from '../../../css'
  declare let $css_loading
  // import Card from "../components/Card.svelte";
  import Config from '../Config.svelte'
  import { getNotificationsContext } from '../../../../thirdparty/svelte-notifications/src/index'

  import UrlPattern from 'url-pattern'
  import Text from '../display/Text.svelte'
  import Bool from '../display/Bool.svelte'
  import Url from '../display/Url.svelte'
  import Color from '../display/Color.svelte'
  import Time from '../display/Time.svelte'
  import GeneralForm from '../../form/Index.svelte'

  import clsx from 'clsx'

  export let model
  export let depth
  export let columns
  export let isdraggable
  export let border
  export let custom_field
  export let onCheck
  export let isContainChildren

  export let selected: boolean
  export let rowValue
  export let showQuickView

  export let rowDoms
  export let rowIndex
  export let isGlobal
  export let getValue
  export let selectedRowsKeys
  export let onSelectRowClick
  export let showRowNum
  export let headerColIsvisibleRow
  export let headerColTypesRow
  export let headerColEditableRow
  export let headerColPropsRow
  export let schema_key
  export let fetchConfig
  export let quickcomponent
  export let quickViewKeys
  export let onDeleteRow
  export let onItemClick
  export let onDeleteClick
  export let colCount
  export let rowEditDoms
  export let onCancel
  export let successSave
  export let deleteRow
  export let expandedRowsKeys
  export let makeUrl
  $: console.log(rowValue)

  let open = false
  let visibility = 'visible'
  let isfolder
  $: isFolder = rowValue && rowValue[0][1] && rowValue[0][1].length

  function toggle() {
    if (isFolder) {
      model[custom_field.open] = !model[custom_field.open]
      //this.$forceUpdate(); //todo fix this
    }
  }

  function dragstart(e) {
    if (navigator.userAgent.indexOf('Firefox') >= 0) {
      // Firefox drag have a bug
      e.dataTransfer.setData('Text', id)
    }

    window.dragId = e.target.children[0].getAttribute('tree-id')
    window.dragPId = e.target.children[0].getAttribute('tree-p-id')
    window.dragParentNode = e.target
    e.target.style.opacity = 0.2
  }

  function dragend(e) {
    e.target.style.opacity = 1
  }

  function setAllCheckData(curList, flag) {
    const listKey = custom_field.lists

    for (let i = 0; i < curList.length; i++) {
      var item = curList[i]
      //this.$set(item, 'checked', flag); // todo fix this

      if (item[listKey] && item[listKey].length) {
        setAllCheckData(item[listKey], flag)
      }
    }
  }

  function onCheckboxClick(evt, model) {
    const list = model[custom_field.lists] // Determine if there is a child node, recursively if necessary

    if (list && isContainChildren) {
      setAllCheckData([model] || [], !!evt.target.checked)
    } else {
      //this.$set(model, 'checked', !!evt.target.checked); //todo fix this
    }

    onCheck && onCheck()
  }

  const onEditSvgKeyPress = key => e => {
    if (e.keyCode == 13 || e.which == 13) {
      quickViewKeys.push(key)
      quickViewKeys = quickViewKeys
    }
  }
  const onEditSvgClick = key => () => {
    quickViewKeys.push(key)
    quickViewKeys = quickViewKeys
  }
  const onDeleteSvgKeyPress = key => e => {
    if (e.keyCode == 13 || e.which == 13) {
      onDeleteRow(key, rowIndex)
    }
  }
  export let highlight = true
</script>

<div
  class="tree-block"
  draggable={!!isdraggable}
  on:dragstart={event => dragstart(event)}
  on:dragend={event => dragend(event)}
  bind:this={rowDoms[rowIndex]}>
  <div
    class="tree-row"
    on:click={toggle}
    data-level={depth}
    tree-id={model[custom_field.id]}
    tree-p-id={model[custom_field.parent_id]}
    class:highlight-row={highlight}
    style={{ backgroundColor: model.backgroundColor }}>

    <Column
      class={['align-' + 'center', 'colIndex' + 0]}
      field={''}
      width={100}
      flex={false}
      {border}>
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
    </Column>
    {#if showRowNum}
      <Column
        class={['align-' + 'center', 'colIndex' + 1]}
        field={''}
        width={100}
        flex={false}
        {border}>
        <span>
          <Space {depth} />
          {#if rowValue[0][1] && rowValue[0][1].length}
            <span
              class={clsx('zip-icon', expandedRowsKeys.includes(getValue(rowValue[0])) ? 'arrow-bottom' : 'arrow-right')} />
          {:else}
            <span class="zip-icon arrow-transparent" />
          {/if}
          <span />
        </span>
        <div>{rowIndex + 1}</div>
      </Column>
    {/if}

    {#each rowValue as c, index}
      {#if headerColIsvisibleRow[index]}
        <Column
          class={['align-' + 'center', 'colIndex' + (index + 2)]}
          field={''}
          width={100}
          flex={false}
          {border}>
          <div>
            {#if headerColEditableRow[index]}
              <GeneralForm
                {schema_key}
                key={getValue(rowValue[0])}
                {fetchConfig}
                selector={['_key', headerColEditableRow[index].s]}
                id="inline"
                buttonlabels={{ save: 'Save', cancel: '' }}
                headerSchema={[[[[], [FormType.hidden, headerColEditableRow[index].t], [], [], [], {}], {}], { r: { result: [[getValue(rowValue[0]), getValue(c)]] } }]} />
            {:else if c != null}
              {#if headerColTypesRow[index] === DisplayType.DateTime}
                {new Date(c).toLocaleString()}
              {:else if headerColTypesRow[index] === DisplayType.Url}
                <Url
                  href={makeUrl(headerColPropsRow[index], c)}
                  value={getValue(c)} />
              {:else if headerColTypesRow[index] === DisplayType.Checkbox}
                <Bool value={getValue(c)} />
              {:else if headerColTypesRow[index] === DisplayType.Color}
                <Color value={getValue(c)} />
              {:else if headerColTypesRow[index] === DisplayType.Time}
                <Time value={getValue(c)} />
              {:else}
                <Text value={getValue(c)} />
              {/if}
            {/if}
          </div>
        </Column>
      {/if}
    {/each}

    {#if !isGlobal}
      <Column
        class={['align-' + 'center', 'colIndex' + (2 + rowValue.length)]}
        field={''}
        width={100}
        flex={false}
        {border}>
        {#if quickcomponent && !quickViewKeys.includes(getValue(rowValue[0]))}
          <svg
            tabindex="0"
            on:keypress={onEditSvgKeyPress(getValue(rowValue[0]))}
            name="edit"
            key={getValue(rowValue[0])}
            on:click={onEditSvgClick(getValue(rowValue[0]))}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71
              7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41
              0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        {/if}
      </Column>
      <Column
        class={['align-' + 'center', 'colIndex' + (2 + rowValue.length + 1)]}
        field={''}
        width={100}
        flex={false}
        {border}>
        {#if !isGlobal}
          <svg
            tabindex="0"
            on:keypress={onDeleteSvgKeyPress(getValue(rowValue[0]))}
            name="delete"
            key={getValue(rowValue[0])}
            type="button"
            on:click={e => onDeleteRow(getValue(rowValue[0]), rowIndex)()}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19
              4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        {/if}
      </Column>
    {/if}
    <!-- <div> -->

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
    <!-- </div> -->

    {#if rowValue[0][1] && rowValue[0][1].length}
      {#each rowValue[0][1] as item, index}
        {#if false}
          {#if isFolder}
            <svelte:self
              v-show="model[custom_field.open]"
              model={item}
              {columns}
              {isdraggable}
              {border}
              depth={depth * 1 + 1}
              {custom_field}
              {onCheck}
              {isContainChildren} />
          {/if}
        {/if}
      {/each}
    {/if}
  </div>

  {#if showQuickView}
    <div class="tree-block">
      <div class="tree-row">
        <div colspan={colCount + (showRowNum ? 1 : 0) + 3}>
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
        </div>
      </div>
    </div>
  {/if}

</div>
