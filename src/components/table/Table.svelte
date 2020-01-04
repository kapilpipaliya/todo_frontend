<script lang='ts'>
  // import * as _ from "lamb";
  import * as R from 'ramda'
  import * as RA from 'ramda-adjunct'
  import { onMount, onDestroy, createEventDispatcher, setContext, tick, S, ws_connected, event_type, events as e, fade, fly, form_type } from '../../modules/functions.ts'
  import {organization_id} from '../../modules/global_stores/organization.ts'
  import {project_id} from '../../modules/global_stores/project.ts'
  import UrlPattern from 'url-pattern'
  const dp = createEventDispatcher()
  import { css } from '../../modules/global_stores/css.ts'
  import { default_filter } from '../../modules/global_stores/default_filter.ts'
  // import Card from "../components/Card.svelte";
  import Modal from './Model.svelte'
  import Config from './Config.svelte'

  export let eventsFn: (id:number, schema: string) => Array<[]>
  let events

  let headerTitlesRow
  let items
  let count

  export let customFilter = {}
  export let requiredFilter = {} // always add this filter when fetch

  export let modelcomponent = false
  export let quickcomponent = false

  export let query = {limit: 0, page: 1} // To get arguments from ?limit=25&page=2

  export let schema_key = ''

  $: {
    setContext('items', items)
  }

  // headers
  let headerVisibleColTypesRow = []
  let headerIsvisibleColumnsRow = []
  let headerColumnPropsRow = []


  let options = {}

  // internal:
  enum DisplayType {
    BOOL=1,
    INT,
    TEXT,
    DOUBLE,
    UTCTIME,
    ARRAY,
    OBJECT,
    BINARY,
    URL
  };

  const hiddenColumns = [DisplayType.ARRAY, DisplayType.OBJECT, DisplayType.BINARY]
  let filterSettings = []
  let sortSettings = []
  let quickview = []
  let selectedRowsKeys = []
  let first_visibile_column = 0
  let fetchConfig = { type: form_type.array }
  // pagination:
  let limit = Number(query.limit) ?? 0
  let pages = [1, 2]
  let current_page = Number(query.page) ?? 1

  let total_pages = Math.max(current_page, 1)

  let mounted = false
  let binded = false
  let er = ''

  let doms = {addbutton: null}
  let addnewform = false
  let headerFetched = false
  let modalIsVisible = false
  let item = []
  let config = false
  let contextmenu = false
  let showRowNum = true

  let header_evt
  let data_evt
  let unsub
  let mutate_evt


  // customFilter, not work with filter..
  $: query, eventsFn, requiredFilter, schema_key, reset()

  function unRegister() {
    unsub && S.trigger([[unsub, {}]])
    events && S.unbind_(events)
  }
  function reset() {
    unRegister()
    events = eventsFn(0, schema_key)
    headerTitlesRow = []
    items = []
    count = 0
    // headers
    headerVisibleColTypesRow = []
    headerIsvisibleColumnsRow = []
    headerColumnPropsRow = []


    options = {}

    // internal:
    // hiddenColumns = [ARRAY, OBJECT, BINARY]
    filterSettings = []
    sortSettings = []
    quickview = []
    selectedRowsKeys = []
    first_visibile_column = 0
    fetchConfig = { type: form_type.array }
    // pagination:
    limit = Number(query.limit) ?? 0
    pages = [1, 2]
    current_page = Number(query.page) ?? 1

    total_pages = Math.max(current_page, 1)

    mounted = true
    binded = false
    er = ''

    // doms = {}
    addnewform = false
    headerFetched = false
    modalIsVisible = false
    item = []
    config = false
    contextmenu = false

    header_evt = events[0]
    data_evt = events[1]
    unsub = [event_type.unsubscribe, ...events[1].slice(1)]
    mutate_evt = events[2]
    console.log('reset complete')
  }

  
  onMount(async () => {
    mounted = true
    $css.table.css.count = $css.table.css.count + 1
  })
  onDestroy(() => {
      unRegister();
      $css.table.css.count = $css.table.css.count - 1
  })

  const bindOnce = () => {
    if (!binded) {
      {
        S.bind$(data_evt, onDataGet, 1)
        S.bind$(header_evt, onHeaderGet, 1)
        if(header_evt){
          const e1 = [header_evt, fetchConfig]
          S.trigger([e1])
        }
      }
      //binded = true
    }
  }
  const onWSConnect = () => {
    if (headerFetched) {
      refresh()
    }
  }
  // this function send subscription request everytime ws connection open
  $: {
      (binded)
    if (mounted) {
      if ($ws_connected) {
        bindOnce()
        binded = true
        er = ''
        onWSConnect()
      } else {
        er = 'Reconnecting...'
      }
    }
  }
  // ================================Re Fetch Data ===============================
  function mergeFilter(f) {
    const s = $default_filter[schema_key]
    if(s) {
      for (let i = 0; i < f.length; i++) {
        if (s[i]) {
          f[i] = s[i]
        }
      }
    }
    return f      
  }
  export const refresh = () => {
    const args = [
      mergeFilter(filterSettings),
      sortSettings,
      [limit, 0, current_page],
      fetchConfig,
    ]
    const e1 = [data_evt, args]
    S.trigger([e1])
  }
  // =============================================================================
  // ================================On Headers and Data Receive =================
  const onHeaderGet = ([d]) => {
    fillHeadersArray(d)
    refresh()
    headerFetched = true
  }
  const fillHeadersArray = d => {
    // see getJsonHeaderData() on server:
    headerTitlesRow = d[0] ?? []
    headerVisibleColTypesRow = d[1] ?? []
    headerIsvisibleColumnsRow = d[2] ?? []
    headerColumnPropsRow = d[3] ?? []
    let i
    for (i = 0; i < headerIsvisibleColumnsRow.length; i++) {
      if (headerIsvisibleColumnsRow[i]) {
        first_visibile_column = i
        break
      }
    }


    options = d[4]
    resetFilter_() // Take care....
  }
  function dropNotExisting(a1: string[], b1:string[]) {
    // if a1 not contains element in b1 remove it from a1 and return it.
    let newa1 = []
    for(let x of a1){
      const idx = b1.indexOf(x)
      // if(idx == -1){a1.splice(idx, 1) } } // cant modify array in loop
      if(idx != -1) {
        newa1.push(x)
      }
    }
    return newa1
  }
  function onDataGet([d]) {
    if (d.r) {
      // reset quickview with empty array:
      // [...Array(20)].map(_=>0)
      // quickview = Array.from({length: d.length}, ()=>0);

      items = d.r.result ?? []
      count = d.r.extra.stats.fullCount
      current_page = d.r.pagination[2] // change page if not same.
      calc_pagination()
      // selectAll_(false)
      selectedRowsKeys = dropNotExisting(selectedRowsKeys, items.map(x=>getValue(x[0])))
    } else if (d.n) {
      items.push(...d.n.result)
      count = count + 1
      items = items
    } else if (d.m) {
      // replace rows in table.
      // show on form that its updated...
      d.m.result.forEach(mod => {
        const findIndex = items.findIndex(i => {
          return i[0] == mod[0]
        })
        if (findIndex !== -1) {
          // start, ?deleteCount, ...items
          items.splice(findIndex, 1, mod)
        }
      })
      items = items
    } else if (d.d) {
      deleteRows_(d.d)
    }
  }
  // ============================================================================
  // ================================Filter ======================================
  const delay_refresh = () => {
    // when filter applied, change current_page to 1 before fetching data, to prevent
    // empty result
    current_page = 1
    refresh()
  };
  //store the timeout, cancel it on each change, then set a new one
  let filter_timeout
  const onHandleFilter = col => event => {
    clearTimeout(filter_timeout);
    filter_timeout = setTimeout(delay_refresh, 250);
  }
  const resetFilter_ = () => {
    const array = new Array(headerTitlesRow.length)
    array.fill(null)
    for (let key in requiredFilter) {
      array[key] = requiredFilter[key]
    }
    filterSettings = array
  }
  const onResetFilter = event => {
    resetFilter_()
    refresh()
  }
  // =============================================================================
  // ================================Add Edit Row ===============================
  const toogleAddForm = () => {
    addnewform = !addnewform
    doms.addbutton.focus()
  }
  const closeForm_ = key => {
    const idx = quickview.findIndex(x => x == key)
    if (idx !== -1) {
      quickview.splice(idx, 1)
      quickview = quickview
    }
  }
  const closeForms_ = keys => {
    let isFind = false
    keys.forEach(key => {
      const idx = quickview.findIndex(x => x == key)
      if (idx !== -1) {
        isFind = true
        quickview.splice(idx, 1)
      }
    })
    if (isFind) {
      quickview = quickview
    }
  }
  const editButtonFocus = async(key) => {
    await tick();
    const element: HTMLElement | null = document.querySelector(`button[key='${key}'][name='edit']`);
      if(element) {
        element.focus()
      }
  }
  const successSave = e => {
    const { key, d } = e.detail
    if (key === null) {
      toogleAddForm()
      doms.addbutton.focus()
    } else {
      closeForm_(key)
      editButtonFocus(key)
    }
  }
  // Great function but now not used
  /*const reFetchRow = async(key) => {
      const e = [...events[1], key]
      const d = await new Promise((resolve, reject) => { S.bind_(e, ([data]) => { resolve(data) }, [[`=${items[key][0]}`]]); });
      if(d) {
        for (let i = 0; i < d[0].length; i++) {
          items[key][i] = d[0][i];
        }
        items[key] = items[key];
      } else {
        alert("error");
      }
      S.unbind(e);
  }*/

  const onCancel = event => {
    const key = event.detail
    closeForm_(key)
    editButtonFocus(key)
  }
  // ============================================================================
  // ================================Delete Row =================================
  const deleteRows_ = keys => {
    keys.forEach(k => {
      const index = selectedRowsKeys.findIndex(x => k === x)
      if (index > -1) {
        selectedRowsKeys.splice(index, 1)
      }
    })
    selectedRowsKeys = selectedRowsKeys

    closeForms_(keys)

    keys.forEach(k => {
      const findIndex = items.findIndex(i => {
        return i[0] == k
      })
      if (findIndex !== -1) {
        // start, ?deleteCount, ...items
        items.splice(findIndex, 1)
      }
    })
    items = items
  }
  const deleteRow = e => {
    const { key } = e.detail
    deleteRows_([key])
  }
  const onDeleteRow = key => async () => {
    const r = confirm('Are You Sure?')
    if (r == true) {
      mutate_evt.pop()
      mutate_evt.push(key)

      const filter = [`="${key}"`]
      const [d] = await new Promise((resolve, reject) => {
        S.bind_(
          mutate_evt,
          d => {
            resolve(d)
          },
          ['DEL', filter]
        )
      })
      if (d.ok) {
        deleteRows_([key])
      } else {
        alert(d.error)
      }
    }
  }
  const onDeleteSelected = async () => {
    const r = confirm('Are You Sure to delete selected rows?')
    if (r == true) {
      mutate_evt.pop()
      mutate_evt.push(12345)

      const filter = [JSON.stringify(selectedRowsKeys)]
      const [d] = await new Promise((resolve, reject) => {
        S.bind_(
          mutate_evt,
          d => {
            resolve(d)
          },
          ['DEL', filter]
        )
      })
      if (d.ok) {
        deleteRows_(selectedRowsKeys)
      } else {
        alert(d.error)
      }
    }
  }
  // ============================================================================
  // ================================Pagination==================================
  const calc_pagination = () => {
    if (limit <= 0) {
      limit = 0
      total_pages = 1
      pages = [1]
      current_page = 1
    } else {
      total_pages = Math.ceil(count / limit)
      const arr = []
      for (let i = 1; i <= total_pages; i++) {
        arr.push(i)
      }
      pages = arr
      if (!pages.includes(current_page)) {
        current_page = 1
      }
    }
  }
  const onLimitChange = () => {
    calc_pagination()
    refresh()
  }
  // ============================================================================
  // ================================Sorting=====================================
  const handleSort = (e, col) => {
    if (e.ctrlKey) {
    } else {
      const sortOrder = sortSettings[col]
      sortSettings = []
      if (sortOrder === undefined) {
        sortSettings[col] = 0
      } else if (sortOrder === 0) {
        sortSettings[col] = 1
      } else {
        sortSettings[col] = undefined
      }
    }
    refresh()
    // if (col.sortable === true && typeof col.value === "function") {
    //   if (sortKey === col.key) {
    //     sortOrder = sortOrder === 1 ? -1 : 1;
    //   } else {
    //     sortOrder = 1;
    //     sortKey = col.key;
    //     sortBy = r => col.value(r);
    //   }
    // }
  }
  // ============================================================================
  // ================================Pass event to Parent. DISABLED =============
  function onItemClick(litem) {
    dp('onItemClick', {
      item: litem,
    })
  }

  function onDeleteClick(litem) {
    dp('onDeleteClick', {
      item: litem,
    })
    return true
  }
  // ============================================================================
  // ================================context-menu================================
  let menuDisplayed = false
  let inputMenuDisplayed = false

  const onHeaderContext = event => {
    const left = event.clientX
    const top = event.clientY

    const menuBox: HTMLElement | null = window.document.querySelector('.menu')
    if (menuBox) {
      menuBox.style.left = left + 'px'
      menuBox.style.top = top + 'px'
      menuBox.style.display = 'block'

      menuDisplayed = true
    }

    // window.addEventListener("click", function() {
    //     if(menuDisplayed == true){
    //         menuBox.style.display = "none";
    //     }
  }
  const onTextInputContext = event => {
    const left = event.clientX
    const top = event.clientY

    const menuBox: HTMLElement | null = window.document.querySelector('.menu-input')
    if (menuBox) {
      menuBox.style.left = left + 'px'
      menuBox.style.top = top + 'px'
      menuBox.style.display = 'block'

      inputMenuDisplayed = true
    }

    // window.addEventListener("click", function() {
    //     if(menuDisplayed == true){
    //         menuBox.style.display = "none";
    //     }
  }
  const closeInputMenu = event => {
    const menuBox: HTMLElement | null = window.document.querySelector('.menu-input')
    if (inputMenuDisplayed == true) {
      menuBox.style.display = 'none'
    }
  }
  // ============================================================================
  // ================================multiple select=============================
  $: allSelected = selectedRowsKeys.length == items.length ? true : false
  $: multipleSelected = selectedRowsKeys.length ? true : false

  const onSelectRowClick = e => {
    const index = selectedRowsKeys.findIndex(x => e.target.value == x)
    if (index > -1) {
      selectedRowsKeys.splice(index, 1)
    } else {
      selectedRowsKeys.push(e.target.value)
    }
    selectedRowsKeys = selectedRowsKeys
    //e.preventDefault();
    //e.stopPropagation();
  }
  const selectAll_ = (v: boolean) => {
    if (v) {
      selectedRowsKeys = items.map(x => x[0])
    } else {
      selectedRowsKeys = []
    }
  }
  const onSelectAllClick = e => {
    selectAll_(e.target.checked)
  }
  // ============================================================================
  // ================================config =============================
  const onConfigClicked = async () => {
    config = !config
  }
  const onConfigApply = e => {
    const { list } = e.detail
    fetchConfig['columns'] = list
    config = false
    const e1 = [header_evt, fetchConfig]
    S.trigger([e1])
    //resetFilter_(); onHeaderGet() will do this.
    sortSettings = []
    // refresh();
  }
  // ============================================================================
  // ================================model functions=============================
  // function onItemClick(litem) {
  //   item = litem;
  //   openModal();
  // }

  function closeModal() {
    modalIsVisible = false
  }

  function openModal() {
    modalIsVisible = true
  }

  function onNewClick() {
    item = []
    openModal()
  }
  // ============================================================================
  /*
{JSON.stringify(items)}
<br>
{JSON.stringify(quickview)}
<br>
{JSON.stringify(selectedRowsKeys)}
  */
function getValue(v) {
  if(RA.isArray(v)) {
    if(v.length > 0) {
      return v[0]
    } else {
      console.log("Array Must has one element")
      return v
    }
  } else {
    return v
  }
}
function isGlobal(v) {
  //return v?.[1] == 'global'
  if(RA.isArray(v)) {
    if(v.length >= 2) {
      return v[1] === 'global'
    }
  }
  return false
}
function makeUrl(props, id){
  return new UrlPattern(props.pattern).stringify({id, org: $organization_id, project: $project_id})
}
function onShowRowNum(){
  showRowNum = !showRowNum
}
$: mergeRowsCount = 3 + (showRowNum ? 1 : 0);
</script>

{er}
{#if $css.table}
<div>

  <button
    name="table_add"
    on:click={toogleAddForm}
    bind:this={doms.addbutton}
    class={addnewform ? 'pressed' : ''}>
    {!addnewform ? 'Add New' : 'Close'}
  </button>
  {#if addnewform}
    <svelte:component
      this={quickcomponent}
      key={null}
      {schema_key}
      {eventsFn}
      on:close={toogleAddForm}
      on:successSave={successSave} />
  {/if}
  <hr />

  <button class="" on:click={onResetFilter}>Reset Filters</button>
  <span>{items.length}{items.length <= 1 ? ' item' : ' items'}</span>
  Page Size:
  <input
    class="w60"
    type="number"
    bind:value={limit}
    on:change={onLimitChange}
    min="0" />
  {#if false}
    <button class="" on:click={refresh}>Refresh</button>
  {/if}
  Page:
  <select bind:value={current_page} on:change={refresh}>
    {#each pages as p}
      <option value={p}>{p}</option>
    {/each}
  </select>
  &nbsp;/&nbsp;{total_pages}
  {#if multipleSelected}
    <button type="button" on:click={onDeleteSelected}>Delete</button>
  {/if}

  <button type="button" on:click={onShowRowNum}>Row Numbers</button>

  <button type="button" on:click={onConfigClicked}>Config</button>
  {#if config}
    <Config
      {schema_key}
      on:close={() => (config = !config)}
      on:configApply={onConfigApply} />
  {/if}

  <table>
    <thead>
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
              on:click={e => handleSort(e, index)}
              on:contextmenu|preventDefault={onHeaderContext}>
              {h}
              {#if sortSettings[index] === 0}
                ▲
              {:else if sortSettings[index] === 1}
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
        <th colspan={mergeRowsCount}/>
        {#each headerTitlesRow as h, index}
          {#if headerIsvisibleColumnsRow[index]}
            {#if customFilter[index]}
              <th>
                <select
                  bind:value={filterSettings[index]}
                  on:change={onHandleFilter(index)}>
                  {#each customFilter[index] as f}
                    <option value={f[1]}>{f[0]}</option>
                  {/each}
                </select>
              </th>
            {:else if !hiddenColumns.includes(headerVisibleColTypesRow[index])}
              {#if headerVisibleColTypesRow[index] === DisplayType.INT}
                <th>
                  <input
                    type="search"
                    bind:value={filterSettings[index]}
                    on:input={onHandleFilter(index)}
                    on:contextmenu|preventDefault={onTextInputContext} />
                </th>
              {:else if headerVisibleColTypesRow[index] === DisplayType.TEXT}
                <th>
                  <input
                    type="search"
                    bind:value={filterSettings[index]}
                    on:input={onHandleFilter(index)}
                    on:contextmenu|preventDefault={onTextInputContext} />
                </th>
              {:else if headerVisibleColTypesRow[index] === DisplayType.DOUBLE}
                <th>
                  <input
                    type="search"
                    bind:value={filterSettings[index]}
                    on:input={onHandleFilter(index)}
                    on:contextmenu|preventDefault={onTextInputContext}
                    step="any" />
                </th>
              {:else if headerVisibleColTypesRow[index] === DisplayType.BOOL}
                <th>
                  <input
                    type="checkbox"
                    bind:checked={filterSettings[index]}
                    on:change={onHandleFilter(index)}
                    on:contextmenu|preventDefault={onTextInputContext}
                    step="any" />
                </th>
              {:else if headerVisibleColTypesRow[index] === DisplayType.UTCTIME}
                <th>Date</th>
              {:else if headerVisibleColTypesRow[index] === DisplayType.URL}
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
    </thead>
    <tbody>
      {#each items as l, cindex (getValue(l[0]))}
        <tr

          
          
          
          class="{selectedRowsKeys.includes(getValue(l[0])) ? $css.table.class.selected || 'selected' : ''}"
          >
          {#if showRowNum}
            <td>{cindex + 1}</td>
          {/if}
          <td>
              {#if !isGlobal(l[0])}
              {#if false}
                <span>ID: {getValue(l[0])}</span>
              {/if}
              <input
                type="checkbox"
                value={getValue(l[0])}
                checked={selectedRowsKeys.includes(getValue(l[0]))}
                on:click={onSelectRowClick} />
              {/if}
          </td>
          <td>
              {#if !isGlobal(l[0])}
              {#if quickcomponent && !quickview.includes(getValue(l[0]))}
                <button
                  name='edit'
                  key={getValue(l[0])}
                  type="button"
                  on:click={() => {
                    quickview.push(getValue(l[0]))
                    quickview = quickview
                  }}>
                  Edit
                </button>
              {/if}
              {/if}
          </td>
          <td>
              {#if !isGlobal(l[0])}
              <button name='delete' key={getValue(l[0])} type="button" on:click={onDeleteRow(getValue(l[0]))}>D</button>
              {/if}
          </td>
          {#each l as c, index}
            {#if headerIsvisibleColumnsRow[index]}
              <td>
                {#if l[index] != null}
                  {#if headerVisibleColTypesRow[index] === DisplayType.UTCTIME}
                    {new Date(l[index]).toLocaleString()}
                  {:else if headerVisibleColTypesRow[index] === DisplayType.URL}
                    <a href={makeUrl(headerColumnPropsRow[index], l[index])}>{headerColumnPropsRow[index].label}</a>
                  {:else}{getValue(l[index])}{/if}
                {/if}
              </td>
            {/if}
          {/each}
          <!-- <td> -->
          {#if false}
            <a href="javascript:;" on:click={() => onItemClick(l)}>
              <span class="icon is-small">
                <i class="fas fa-edit" />
                edit
              </span>
            </a>

            <a href="javascript:;" on:click={() => onDeleteClick(l)}>
              <span class="icon is-small">
                <i class="fas fa-trash" />
                delete
              </span>
            </a>
          {/if}
          <!-- </td> -->
        </tr>
        {#if quickview.includes(getValue(l[0]))}
          <tr>
            <td colspan={l.length + 3}>
              {#if quickcomponent}
                <svelte:component
                  this={quickcomponent}
                  key={getValue(l[0])}
                  {schema_key}
                  {eventsFn}
                  on:close={onCancel}
                  on:successSave={successSave}
                  on:deleteRow={deleteRow} />
              {/if}
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>

{#if contextmenu}
  <div class="menu">
    <div class="menu-item">Share On Facebook</div>
    <div class="menu-item">Share On Twitter</div>
    <hr />
    <div class="menu-item">Search On Google</div>
    <div class="menu-item">Search On Bing</div>
    <hr />
    <div class="menu-item">Bookmark</div>
  </div>
  <div class="menu-input">
    <div class="menu-item" on:click={closeInputMenu}>Close</div>
    <hr />
    <div class="menu-item">What's This?</div>
    <hr />
    <div class="menu-item">Is NULL</div>
    <div class="menu-item">Is not NULL</div>
    <div class="menu-item">Is empty</div>
    <div class="menu-item">Is not empty</div>
    <hr />
    <div class="menu-item">Equal to...</div>
    <div class="menu-item">Not equal to...</div>
    <div class="menu-item">Greater than...</div>
    <div class="menu-item">Less than...</div>
    <div class="menu-item">Greater or equal...</div>
    <div class="menu-item">Less or equal...</div>
    <div class="menu-item">In range...</div>
  </div>
  <div class="menu">
    <div class="menu-item">Share On Facebook</div>
    <div class="menu-item">Share On Twitter</div>
    <hr />
    <div class="menu-item">Search On Google</div>
    <div class="menu-item">Search On Bing</div>
    <hr />
    <div class="menu-item">Bookmark</div>
  </div>
{/if}
</div>

{#if modalIsVisible}
  <Modal on:close={closeModal}>
    <header slot="header">
      <button class="" aria-label="close" on:click={closeModal}>
        X
      </button>
    </header>

    <svelte:component
      this={modelcomponent}
      on:close={closeModal}
      on:successSave={refresh}
      {headerTitlesRow}
      {items} />
  </Modal>
{/if}

{/if}