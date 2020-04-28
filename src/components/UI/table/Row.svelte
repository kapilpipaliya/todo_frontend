<script context="module">
  import Column from './Column.svelte';
  import Space from './Space.svelte';
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { FormType, DisplayType } from '../../../enums';
  import { css } from '../../../css';
  import { isArray, isNumber } from 'ramda-adjunct';
  declare let $css;
  import Text from '../display/Text.svelte';
  import Bool from '../display/Bool.svelte';
  import Url from '../display/Url.svelte';
  import Color from '../display/Color.svelte';
  import Time from '../display/Time.svelte';
  // import Modal from '../../UI/Model.svelte'
  // import Card from "../../UI/Card.svelte";
  import GeneralForm from '../../form/Index.svelte';
  import Table from '../Table.svelte';

  export let depth;
  export let isdraggable;
  export let border;
  export let rowValue;
  export let rowIndex;
  export let isGlobalRow;
  export let getValue;
  export let selectedRowsKeys;
  export let onSelectRowClick;
  export let showRowNum;
  export let headerColIsvisibleRow;
  export let headerColTypesRow;
  export let headerColEditableRow;
  export let headerColPropsRow;
  export let schema_key;
  export let fetchConfig;
  export let quickcomponent;
  export let quickViewKeys;
  export let onDeleteRow;
  export let onItemClick;
  export let onDeleteClick;
  export let colCount;
  export let rowEditDoms;
  export let onCancel;
  export let successSave;
  export let deleteRow;
  export let expandedRowsKeys;
  export let makeUrl;
  export let onEditSvgKeyPress;
  export let onEditSvgClick;
  export let onDeleteSvgKeyPress;
  export let toggleexpandedRowsKeys;
  export let parentKey = null;
  export let setDragData;

  let key;
  $: key = getValue(rowValue[0]);
  let isGlobal;
  $: isGlobal = isGlobalRow(rowValue[0]);
  let isFolder;
  // $: isFolder = rowValue && isArray(rowValue[0]) && rowValue[0][1] && rowValue[0][1].length;
  $: isFolder = rowValue && rowValue[2] ? true : false;

  function toggle() {
    if (isFolder) {
      toggleexpandedRowsKeys(key);
    }
  }
  function dragstart(e) {
    // console.log('drag start', e);
    setDragData({
      key,
      dragId: e.target.children[0].getAttribute('tree-id'),
      dragRevId: e.target.children[0].getAttribute('tree-rev-id'),
      dragPId: e.target.children[0].getAttribute('tree-p-id'),
      dragParentNode: e.target
    });
    // The data is only available on drop, this is a security feature since a website could grab data when you happen to be dragging something across the webpage.
    // https://stackoverflow.com/questions/28487352/dragndrop-datatransfer-getdata-empty
    // Firefox drag have a bug // unused
    // Required to make it work in Firefox, but not used in this example.
    e.dataTransfer.setData('source', key); // data should be string
    e.target.style.opacity = 0.2;
  }
  function dragend(e) {
    //console.log('drag eneded', e);
    e.target.style.opacity = 1;
  }
  function setAllCheckData(curList, flag) {
    const listKey = 'lists';

    for (let i = 0; i < curList.length; i++) {
      var item = curList[i];
      //this.$set(item, 'checked', flag); // todo fix this

      if (item[listKey] && item[listKey].length) {
        setAllCheckData(item[listKey], flag);
      }
    }
  }
  function onCheckboxClick(evt) {
    const list = rowValue['lists']; // Determine if there is a child node, recursively if necessary

    if (list) {
      setAllCheckData([rowValue] || [], !!evt.target.checked);
    } else {
      //this.$set(rowValue, 'checked', !!evt.target.checked); //todo fix this
    }
  }

  let highlight = false; // todo: based on headerColPropsRow[index] logic
</script>

<div class="tree-block" draggable={!!isdraggable} on:dragstart={dragstart} on:dragend={dragend}>
  <div
    class={clsx('tree-row', selectedRowsKeys.includes(key) ? $css.table.classes.selected || 'selected' : '')}
    on:click={toggle}
    data-level={depth}
    tree-id={key}
    tree-rev-id={rowValue[1]}
    tree-p-id={parentKey}
    class:highlight-row={highlight}>
    <Column class={['align-' + 'center', 'colIndex' + 0]} width={25} flex={false} {border}>
      {#if !isGlobal}
        <input
          type="checkbox"
          value={key}
          checked={selectedRowsKeys.includes(key)}
          on:click|stopPropagation={onSelectRowClick} />
      {/if}
    </Column>
    {#if showRowNum}
      <Column class={['align-' + 'center', 'colIndex' + 1]} width={50} flex={false} {border}>
        <span>
          <Space {depth} />
          {#if isFolder}
            <span class={clsx('zip-icon', expandedRowsKeys.includes(key) ? 'arrow-bottom' : 'arrow-right')} />
          {:else}
            <span class="zip-icon arrow-transparent" />
          {/if}
          <span />
        </span>
        <span>{rowIndex + 1}</span>
      </Column>
    {/if}

    {#each rowValue as c, index}
      {#if headerColIsvisibleRow[index]}
        <Column class={['align-' + 'center', 'colIndex' + (index + 2)]} width={100} flex={false} {border}>
          <div>
            {#if headerColEditableRow[index]}
              <GeneralForm
                {schema_key}
                {key}
                {fetchConfig}
                selector={['_key', headerColEditableRow[index].s]}
                id="inline"
                buttonlabels={{ save: 'Save', cancel: '' }}
                headerSchema={[[[[], [FormType.hidden, headerColEditableRow[index].t], [], [], [], {}], {}], { r: { result: [[key, getValue(c)]] } }]} />
            {:else if c != null}
              {#if headerColTypesRow[index] === DisplayType.DateTime}
                {new Date(c).toLocaleString()}
              {:else if headerColTypesRow[index] === DisplayType.Url}
                <Url href={makeUrl(headerColPropsRow[index], c)} value={getValue(c)} />
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
      <Column class={['align-' + 'center', 'colIndex' + (2 + rowValue.length)]} width={100} flex={false} {border}>
        {#if quickcomponent && !quickViewKeys.includes(key)}
          <svg
            tabindex="0"
            on:keypress={onEditSvgKeyPress(key)}
            name="edit"
            {key}
            on:click|stopPropagation={onEditSvgClick(key)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02
              0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        {/if}
        {#if !isGlobal}
          <svg
            tabindex="0"
            on:keypress={onDeleteSvgKeyPress(key)}
            name="delete"
            {key}
            type="button"
            on:click|stopPropagation={onDeleteRow(key)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        {/if}
      </Column>
    {/if}

    <!-- <Column> -->
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
    <div class="hover-model" style="display: none">
      <div class="hover-block prev-block">
        <i class="el-icon-caret-top" />
      </div>
      <div class="hover-block center-block">
        <i class="el-icon-caret-right" />
      </div>
      <div class="hover-block next-block">
        <i class="el-icon-caret-bottom" />
      </div>
    </div>
  </div>

  {#if quickViewKeys.includes(key)}
    <div class="tree-block" draggable="true" on:dragstart|preventDefault|stopPropagation={_ => 0}>
      <div class="tree-row">
        <div colspan={colCount + (showRowNum ? 1 : 0) + 3}>
          {#if quickcomponent}
            <svelte:component
              this={quickcomponent}
              bind:this={rowEditDoms[key]}
              {key}
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

  <!--   {#if isFolder}
    {#each rowValue[0][1] as item, index}
      {#if expandedRowsKeys.includes(key)}
        {#if isFolder}
          <svelte:self
            depth={depth * 1 + 1}
            {isdraggable}
            {border}
            rowValue={item}
            rowIndex={index}
            {isGlobalRow}
            {getValue}
            {selectedRowsKeys}
            {onSelectRowClick}
            {showRowNum}
            {headerColIsvisibleRow}
            {headerColTypesRow}
            {headerColEditableRow}
            {headerColPropsRow}
            {schema_key}
            {fetchConfig}
            {quickcomponent}
            {quickViewKeys}
            {onDeleteRow}
            {onItemClick}
            {onDeleteClick}
            {colCount}
            bind:rowEditDoms
            {onCancel}
            {successSave}
            {deleteRow}
            {expandedRowsKeys}
            {makeUrl}
            {onEditSvgKeyPress}
            {onEditSvgClick}
            {onDeleteSvgKeyPress}
            {toggleexpandedRowsKeys}
            parentKey={key}
            {setDragData} />
        {/if}
      {/if}
    {/each}
  {/if} -->

  {#if isFolder}
    {#if expandedRowsKeys.includes(key)}
      <Table
        {schema_key}
        fetchConfig={{ parent: rowValue[0], ...fetchConfig }}
        syncQueryParams={false}
        modelcomponent={quickcomponent}
        {quickcomponent} />
    {/if}
  {/if}

</div>
