<script>
  // import * as _ from "lamb";
  import {
    createEventDispatcher,
    setContext,
    onMount,
    onDestroy,
    beforeUpdate,
  } from 'svelte'
  const dp = createEventDispatcher()
  import * as R from 'ramda'

  import { S, ws_connected, event_type, events as e } from '../../modules/functions.js'
  import { css } from '../../modules/global_stores/css.js'
  // import Card from "../components/Card.svelte";
  import Modal from './Model.svelte'
  import Config from './Config.svelte'
  import { fade, fly } from 'svelte/transition'

  export let eventsFn = () => 0
  let events

  let headers
  let items
  let count

  export let customFilter = {}
  export let requiredFilter = {} // always add this filter when fetch

  export let modelcomponent = false
  export let quickcomponent = false

  export let query = {} // To get arguments from ?limit=25&page=2

  export let schema_key = ''

  $: {
    setContext('items', items)
  }

  // headers
  let formLabels = []
  let headerColTypes = []
  let visible_columns = []
  let offset_columns = []
  let tooltip_offset_columns = []
  let options = {}

  // internal:

  const BOOL = 10,
    INT = 20,
    TEXT = 30,
    DOUBLE = 40,
    UTCTIME = 50,
    ARRAY = 60,
    OBJECT = 70,
    BINARY = 80

  const hiddenColumns = [ARRAY, OBJECT, BINARY]
  let filterSettings = []
  let sortSettings = []
  let quickview = []
  let selectedRowsKeys = []
  let first_visibile_column = 0
  let fetchConfig = { type: 'a' }
  // pagination:
  let limit = Number(query.limit) || 0
  let pages = [1, 2]
  let current_page = Number(query.page) || 1

  let total_pages = Math.max(current_page, 1)

  let mounted = false
  let binded = false
  let er = ''

  let doms = {}
  let addnewform = false
  let headerFetched = false
  let modalIsVisible = false
  let item = []
  let config = false
  let contextmenu = false

  let header_evt
  let data_evt
  let unsub
  let mutate_evt

  // customFilter, not work with filter..
  $: query, eventsFn, requiredFilter, schema_key, reset()

  function reset() {
  events = eventsFn(0, schema_key)
  headers = []
  items = []
  count = 0
  // headers
  formLabels = []
  headerColTypes = []
  visible_columns = []
  offset_columns = []
  tooltip_offset_columns = []
  options = {}

  // internal:
  // hiddenColumns = [ARRAY, OBJECT, BINARY]
  filterSettings = []
  sortSettings = []
  quickview = []
  selectedRowsKeys = []
  first_visibile_column = 0
  fetchConfig = { type: 'a' }
  // pagination:
  limit = Number(query.limit) || 0
  pages = [1, 2]
  current_page = Number(query.page) || 1

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
      S.trigger([[unsub, {}]])
      S.unbind_(events)
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
  export const refresh = () => {
    const args = [
      filterSettings,
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
    headers = d[0] || []
    formLabels = d[1] || []
    headerColTypes = d[2] || []
    visible_columns = d[3] || []
    let i
    for (i = 0; i < visible_columns.length; i++) {
      if (visible_columns[i]) {
        first_visibile_column = i
        break
      }
    }
    offset_columns = d[4]
    tooltip_offset_columns = d[5]
    options = d[6]
    resetFilter_() // Take care....
  }
  function onDataGet([d]) {
    if (d.r) {
      // reset quickview with empty array:
      // [...Array(20)].map(_=>0)
      // quickview = Array.from({length: d.length}, ()=>0);

      items = d.r.result || []
      count = d.r.extra.stats.fullCount
      current_page = d.r.pagination[2] // change page if not same.
      calc_pagination()
      selectAll_(false)
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
  const handleFilter = col => event => {
    // when filter applied, change current_page to 1 before fetching data, to prevent
    // empty result
    current_page = 1
    refresh()
  }
  const resetFilter_ = () => {
    const array = new Array(headers.length)
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
  const successSave = e => {
    const { key, d } = e.detail
    if (key === null) {
      toogleAddForm()
      // refresh(); // should be automatic
    } else {
      closeForm_(key)
      // reFetchRow(key); // should be automatic
    }
    doms.addbutton.focus()
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
    closeForm_(event.detail)
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
      }, 0)
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
      }, 0)
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
      if (pages.indexOf(current_page) === -1) {
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

    const menuBox = window.document.querySelector('.menu')
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

    const menuBox = window.document.querySelector('.menu-input')
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
    const menuBox = window.document.querySelector('.menu-input')
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
  const selectAll_ = v => {
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
    fetchConfig.columns = list
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

</script>

{er}
{#if $css.table}
<div>

  <button
    name="table_add"
    on:click={toogleAddForm}
    bind:this={doms.addbutton}
    class={addnewform ? 'pressed' : ''}>
    Add New
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
        <th colspan="3">
          <input
            type="checkbox"
            bind:checked={allSelected}
            on:click={onSelectAllClick} />
          Actions
        </th>
        {#each headers as h, index}
          {#if visible_columns[index]}
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
        <th colspan="3"/>
        {#each headers as h, index}
          {#if visible_columns[index]}
            {#if customFilter[index]}
              <th>
                <select
                  bind:value={filterSettings[index]}
                  on:change={handleFilter(index)}>
                  {#each customFilter[index] as f}
                    <option value={f[1]}>{f[0]}</option>
                  {/each}
                </select>
              </th>
            {:else if !hiddenColumns.includes(headerColTypes[index])}
              {#if headerColTypes[index] === INT}
                <th>
                  <input
                    type="search"
                    bind:value={filterSettings[index]}
                    on:input={handleFilter(index)}
                    on:contextmenu|preventDefault={onTextInputContext} />
                </th>
              {:else if headerColTypes[index] === TEXT}
                <th>
                  <input
                    type="search"
                    bind:value={filterSettings[index]}
                    on:input={handleFilter(index)}
                    on:contextmenu|preventDefault={onTextInputContext} />
                </th>
              {:else if headerColTypes[index] === DOUBLE}
                <th>
                  <input
                    type="search"
                    bind:value={filterSettings[index]}
                    on:input={handleFilter(index)}
                    on:contextmenu|preventDefault={onTextInputContext}
                    step="any" />
                </th>
              {:else if headerColTypes[index] === UTCTIME}
                <th>Date</th>
              {:else}
                <th>Unknown Type</th>
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
      {#each items as l, cindex (l[0])}
        <tr

          draggable="true"
          on:mouseenter={e => {}}
          on:mouseleave={e => {}}
          class="{selectedRowsKeys.includes(l[0]) ? $css.table.class.selected || 'selected' : ''}"
          >
          <td>
              {#if false}
                <span>ID: {l[0]}</span>
              {/if}
              <input
                type="checkbox"
                value={l[0]}
                checked={selectedRowsKeys.includes(l[0])}
                on:click={onSelectRowClick} />
          </td>
          <td>
              {#if quickcomponent && !quickview.includes(l[0])}
                <button
                  name='edit'
                  key={l[0]}
                  type="button"
                  on:click={() => {
                    quickview.push(l[0])
                    quickview = quickview
                  }}>
                  Edit
                </button>
              {/if}
          </td>
          <td>
              <button name='delete' key={l[0]} type="button" on:click={onDeleteRow(l[0])}>D</button>
          </td>
          {#each l as c, index}
            {#if visible_columns[index]}
              <td title={l[index + (tooltip_offset_columns[index] || 0)]}>
                {#if l[index + (offset_columns[index] || 0)] != null}
                  {#if headerColTypes[index] === 1114}
                    {new Date(l[index + (offset_columns[index] || null)]).toLocaleString()}
                  {:else}{l[index + (offset_columns[index] || 0)]}{/if}
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
        {#if quickview.includes(l[0])}
          <tr>
            <td colspan={l.length + 1}>
              {#if quickcomponent}
                <svelte:component
                  this={quickcomponent}
                  key={l[0]}
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
      {headers}
      {items} />
  </Modal>
{/if}

{/if}