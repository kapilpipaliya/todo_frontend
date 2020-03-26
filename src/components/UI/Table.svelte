<script lang="ts">
  // TODO fix table row hightlight not working properly when some row is deleted.
  // Add Two modes on button press change classes
  // Instead of alter show model on delete
  /*
   https://datatables.net/examples/api/select_row.html
   context menu 
    1. serve list from schema
    2. show edit/delete links on  menu.
   use star component to show priorities. 
   make two modes bordered / Overflow 
   use svelte simple model for delele 
   no extra json info pass by server to table 
   if select id is empty not show link
   make custom filter object fetch from database
   Implement pagination button
   make dynamic filter form for table too 
   when write Task table -> enable drag and drop rows. -> tree support -> make grantt chart 
   make drag handle bar on action column
   Make Filter Dialogs to easily input filter on table
   HOW JS TABLE drag and drop
 */
  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    getContext,
    tick
  } from 'svelte'
  import { view, lensPath } from 'ramda'
  import { isArray } from 'ramda-adjunct'
  import { get, writable } from 'svelte/store'
  import { S, ws_connected } from '../../ws_events_dispatcher'
  import { fade, fly } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import {
    IS_PRODUCTION,
    ET,
    E,
    schemaEvents,
    ValueType,
    FormType,
    DisplayType
  } from '../../enums'
  declare let $ws_connected
  import { translation } from '../../translation'
  declare let $translation
  import Modal from '../UI/Model.svelte'
  import Error from '../UI/Error.svelte'
  import Skeleton from '../UI/Skeleton.svelte'
  import { css, css_count } from '../../css'
  // import Card from "../components/Card.svelte";
  import Config from './Config.svelte'
  import { getNotificationsContext } from '../../../thirdparty/svelte-notifications/src/index'

  import UrlPattern from 'url-pattern'
  import Text from './display/Text.svelte'
  import Bool from './display/Bool.svelte'
  import Url from './display/Url.svelte'
  import Color from './display/Color.svelte'
  import Time from './display/Time.svelte'
  import GeneralForm from '../form/Index.svelte'

  export let modelcomponent = false
  export let quickcomponent = false
  export let schema_key = ''
  export let pass = [] // [["context", "org_data", "_key", "org"]]
  export let query = { limit: 0, page: 1, filter: [] } // To get arguments from ?limit=25&page=2
  export let requiredFilter = [] // always add this filter when fetch // used when showing custom table

  css_count.increase('table')
  let project = getContext('project')
  let project_ctx = project ? get(project) || [] : []
  let fetchConfig = {
    type: ValueType.Array,
    project: project_ctx?.[project_ctx.length - 1]?._key ?? null
  }
  function setPass() {
    if (Array.isArray(pass)) {
      for (let i = 0; i < pass.length; i++) {
        if (Array.isArray(pass[i]) && pass[i].length > 0) {
          let e = pass[i]
          if (Array.isArray(e) && e.length > 0) {
            const func = e[0]
            if (typeof func == 'string') {
              if (func == 'context') {
                if (e.length > 1) {
                  const key = e[1]
                  const data = get(getContext(key))
                  let addKey = e.length > 2 ? e[2] : key
                  fetchConfig[addKey] = data
                  continue
                }
              } else if (func == 'contextKey') {
                if (e.length > 1) {
                  const key = e[1]
                  let objKey = e.length > 2 ? e[2] : '_key'
                  let addKey = e.length > 3 ? e[3] : key
                  const data = get(getContext(key))[objKey]
                  fetchConfig[addKey] = data
                  continue
                }
              } else if (func == 'contextKeyInArray') {
                if (e.length > 1) {
                  const key = e[1]
                  let objKey = e.length > 2 ? e[2] : '_key'
                  pass[i] = [get(getContext(key))[objKey]]
                  continue
                }
              }
            }
          }
        }
      }
    }
  }
  setPass()

  // =============================================================================
  // ================================Filter ======================================
  let filterSettings = query.filter ? JSON.parse(query.filter) : []
  $: {
    history.pushState(
      {},
      '',
      '?limit=' +
        limit +
        '&page=' +
        current_page +
        '&sort=' +
        JSON.stringify(headerColSortSettingsRow) +
        '&filter=' +
        JSON.stringify(filterSettings)
    )
  }
  const delay_refresh = () => {
    // when filter applied, change current_page to 1 before fetching data, to prevent
    // empty result
    current_page = 1
    refresh()
  }
  //store the timeout, cancel it on each change, then set a new one
  let filter_timeout
  const onHandleFilter = col => event => {
    clearTimeout(filter_timeout)
    filter_timeout = setTimeout(delay_refresh, 250)
  }
  const resetFilter_ = () => {
    const array = new Array(headerColTitlesRow.length)
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
  // ============================================================================
  // ================================Pagination==================================
  let limit = Number(query.limit) || 0
  let pages = [1, 2]
  let current_page = Number(query.page) || 1
  let total_pages = Math.max(current_page, 1)
  let count = 0
  const calc_pagination = () => {
    //console.log(count, limit, total_pages, pages, current_page)
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
    //console.log(count, limit, total_pages, pages, current_page)
  }
  const onLimitChange = () => {
    calc_pagination()
    refresh()
    //note: after refresh calc_pagination() will be called again.
  }
  // ================================Re Fetch Data ===============================
  let er = ''
  if (!schema_key) {
    er = 'schema key is invalid in table'
  }
  let events = schemaEvents(schema_key)
  if (!events) er = 'events array must be defined'
  const uid = S.uid
  let data_evt = [ET.subscribe, events[0], uid]
  let unsub_evt = [ET.unsubscribe, events[0], uid]
  let mounted = false
  onMount(() => {
    mounted = true
  })
  onDestroy(() => {
    unsub_evt && S.trigger([[unsub_evt, {}]])
    events && S.unbind_(events)
    css_count.decrease('table')
  })
  S.bind$(data_evt, onDataGet, 1)
  const onWSConnect = () => {
    refresh()
  }
  $: {
    if (mounted) {
      if ($ws_connected) {
        er = ''
        onWSConnect()
      } else {
        er = 'Reconnecting...'
      }
    }
  }
  function mergeFilter(f) {
    /*const s = $default_filter[schema_key]
    if(s) {
      for (let i = 0; i < f.length; i++) {
        if (s[i]) {
          f[i] = s[i]
        }
      }
    }*/
    return f
  }
  export const refresh = () => {
    const args = [
      mergeFilter(filterSettings),
      headerColSortSettingsRow,
      [limit, 0, current_page],
      fetchConfig
    ]
    const e1 = [data_evt, args]
    S.trigger([e1])
  }
  // =============================================================================
  // ================================On Headers and Data Receive =================
  let items = []
  let addnew_pos = 't'
  let addnew_type = 'button'
  let addnew_labels = { save: 'Save', cancel: 'Cancel' }
  let rowType = 'table'
  let showHeader = true
  // delete this function
  let headerFetched = false
  const onHeaderGet = ([d]) => {
    fillHeadersArray(d)
    refresh()
    headerFetched = true
  }
  let headerColTitlesRow = []
  let headerColTypesRow = []
  let headerColIsvisibleRow = []
  let headerColSortSettingsRow = []
  let headerColEditableRow = []
  let headerColPropsRow = []
  let headerColCustomFilter = [] // Todo Make it set by backend
  let options = {}
  let first_visibile_column = 0
  let authorized = true
  let selectedRowsKeys = []
  const fillHeadersArray = d => {
    // see getJsonHeaderData() on server:
    headerColTitlesRow = d[0] ?? []
    headerColTypesRow = d[1] ?? []
    headerColIsvisibleRow = d[2] ?? []
    headerColSortSettingsRow = query.sort ? JSON.parse(query.sort) : d[3] ?? []
    headerColEditableRow = d[4] ?? []
    headerColPropsRow = d[5] ?? []
    options = d[6]
    if (IS_PRODUCTION && !options.k) {
      const keyIdx = headerColTitlesRow.findIndex(x => x === 'Key')
      if (keyIdx > -1) {
        headerColIsvisibleRow[keyIdx] = 0
      }
    }
    let i
    for (i = 0; i < headerColIsvisibleRow.length; i++) {
      if (headerColIsvisibleRow[i]) {
        first_visibile_column = i
        break
      }
    }

    addnew_pos = options?.add?.pos ?? 't'
    addnew_type = options?.add?.type ?? 'button'
    const l = options?.add?.l
    if (l) {
      addnew_labels = l
    }
    showHeader = options?.table?.header ?? true
    rowType = options?.table?.row ?? 'table'
    // resetFilter_() // Take care.... why this is needed?
  }
  function dropNotExisting(a1: string[], b1: string[]) {
    // if a1 not contains element in b1 remove it from a1 and return it.
    let newa1 = []
    for (let x of a1) {
      const idx = b1.indexOf(x)
      // if(idx == -1){a1.splice(idx, 1) } } // cant modify array in loop
      if (idx != -1) {
        newa1.push(x)
      }
    }
    return newa1
  }
  let isLoading = true
  function onDataGet(all) {
    if (isLoading) isLoading = false
    const [h, d] = all
    if (h === false) {
      authorized = false
      er = d
    }
    if (h.length) {
      fillHeadersArray(h)
    }
    if (d.r) {
      // reset quickViewKeys with empty array:
      // [...Array(20)].map(_=>0)
      // quickViewKeys = Array.from({length: d.length}, ()=>0);

      items = d.r.result ?? []
      count = d.r.fullCount
      current_page = d.r.pagination[2] // change page if not same.
      calc_pagination()
      // selectAll_(false)
      selectedRowsKeys = dropNotExisting(
        selectedRowsKeys,
        items.map(x => getValue(x[0]))
      )
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
  // =============================================================================
  // ================================Add Edit Row ===============================
  let doms = { addbutton: null }
  let addnewform = false
  let quickViewKeys = []
  const toogleAddForm = () => {
    if (addnew_type == 'button') {
      addnewform = !addnewform
      if (doms.addbutton) {
        doms.addbutton.focus()
      } else {
        er = 'no dom for add button!'
      }
    }
  }
  const closeForm_ = key => {
    const idx = quickViewKeys.findIndex(x => x == key)
    if (idx !== -1) {
      quickViewKeys.splice(idx, 1)
      quickViewKeys = quickViewKeys
    }
  }
  const closeForms_ = keys => {
    let isFind = false
    keys.forEach(key => {
      const idx = quickViewKeys.findIndex(x => x == key)
      if (idx !== -1) {
        isFind = true
        quickViewKeys.splice(idx, 1)
      }
    })
    if (isFind) {
      quickViewKeys = quickViewKeys
    }
  }
  const editButtonFocus = async key => {
    await tick()
    const element: HTMLElement | null = document.querySelector(
      `button[key='${key}'][name='edit']`
    )
    if (element) {
      element.focus()
    }
  }
  const successSave = e => {
    if (e.detail.key === null) {
      toogleAddForm()
    } else {
      closeForm_(e.detail.key)
      editButtonFocus(e.detail.key)
    }
  }
  const onCancel = event => {
    const key = event.detail
    closeForm_(key)
    editButtonFocus(key)
  }
  // ============================================================================
  // ================================Delete Row =================================
  let rowEditDoms = []
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
      const findIndex = items.findIndex(i => i[0] == k)
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
  const { addNotification } = getNotificationsContext()
  const onDeleteRow = (key, rowIdx) => async () => {
    const r = confirm('Are You Sure?')
    if (r == true) {
      const mutate_evt = [ET.delete_, events[1], key]
      const filter = [`="${key}"`]
      const d = await new Promise((resolve, reject) => {
        // send unsubscribe event if edit is open
        const args = ['DEL', filter, fetchConfig]
        if (rowEditDoms[rowIdx]) {
          const unsu_event = rowEditDoms[rowIdx]?.f?.unsub_evt ?? null
          if (unsu_event) {
            args.push(unsu_event)
          }
        }
        S.bindT(
          mutate_evt,
          d => {
            resolve(d)
          },
          args
        )
      })
      if (d[0]) {
        const delete_msg = view(lensPath(['msg', 'delete']), $translation)
        addNotification({
          text: delete_msg,
          position: 'bottom-right',
          type: 'danger',
          removeAfter: 4000
        })
        deleteRows_([key])
      } else {
        alert(d[1])
      }
    }
  }
  const onDeleteSelected = async () => {
    const r = confirm('Are You Sure to delete selected rows?')
    if (r == true) {
      const mutate_evt = [ET.delete_, events[1], S.uid]
      const filter = [JSON.stringify(selectedRowsKeys)]
      const d = await new Promise((resolve, reject) => {
        S.bindT(
          mutate_evt,
          d => {
            resolve(d)
          },
          ['DEL', filter]
        )
      })
      d[0] ? deleteRows_(selectedRowsKeys) : alert(d[1])
    }
  }
  // ============================================================================
  // ================================Sorting=====================================
  const onHandleSort = (e, col, order) => {
    if (e.ctrlKey) {
    } else {
      if (order !== undefined) {
        headerColSortSettingsRow = []
        headerColSortSettingsRow[col] = order
        closeHeaderMenu()
      } else {
        const sortOrder = headerColSortSettingsRow[col]
        headerColSortSettingsRow = []
        if (sortOrder === null || sortOrder === undefined) {
          headerColSortSettingsRow[col] = 0
        } else if (sortOrder === 0) {
          headerColSortSettingsRow[col] = 1
        } else {
          headerColSortSettingsRow[col] = null
        }
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
  const dp = createEventDispatcher()
  function onItemClick(litem) {
    dp('onItemClick', { item: litem })
  }
  function onDeleteClick(litem) {
    dp('onDeleteClick', { item: litem })
  }
  // ============================================================================
  // ================================context-menu================================
  let headerMenuDisplayed = false
  let inputheaderMenuDisplayed = false
  let headerMenuColumn = 0
  let inputHeaderMenuColumn = 0
  const onHeaderContext = (e, col) => {
    const left = event.clientX
    const top = event.clientY
    const menuBox: HTMLElement | null = window.document.querySelector('.menu')
    if (menuBox) {
      menuBox.style.left = left + 'px'
      menuBox.style.top = top + 'px'
      menuBox.style.display = 'block'
      headerMenuDisplayed = true
      headerMenuColumn = col
    }
    // window.addEventListener("click", function() {
    //     if(headerMenuDisplayed == true){
    //         menuBox.style.display = "none";
    //     }
  }
  const onTextInputContext = (e, col) => {
    const left = event.clientX
    const top = event.clientY
    const menuBox: HTMLElement | null = window.document.querySelector(
      '.menu-input'
    )
    if (menuBox) {
      menuBox.style.left = left + 'px'
      menuBox.style.top = top + 'px'
      menuBox.style.display = 'block'
      inputheaderMenuDisplayed = true
      inputHeaderMenuColumn = col
    }
    // window.addEventListener("click", function() {
    //     if(headerMenuDisplayed == true){
    //         menuBox.style.display = "none";
    //     }
  }
  const closeHeaderMenu = () => {
    const menuBox: HTMLElement | null = window.document.querySelector('.menu')
    if (headerMenuDisplayed == true) {
      menuBox.style.display = 'none'
    }
  }
  const closeInputMenu = () => {
    const menuBox: HTMLElement | null = window.document.querySelector(
      '.menu-input'
    )
    if (inputheaderMenuDisplayed == true) {
      menuBox.style.display = 'none'
    }
  }
  // ============================================================================
  // ================================multiple select=============================
  let allSelected
  let multipleSelected
  $: allSelected = selectedRowsKeys.length == items.length ? true : false
  $: multipleSelected = selectedRowsKeys.length ? true : false

  const onSelectRowClick = e => {
    const index = selectedRowsKeys.findIndex(x => e.target.value == x)
    index > -1
      ? selectedRowsKeys.splice(index, 1)
      : selectedRowsKeys.push(e.target.value)
    selectedRowsKeys = selectedRowsKeys
    //e.preventDefault();
    //e.stopPropagation();
  }
  const selectAll_ = (v: boolean) =>
    (selectedRowsKeys = v ? items.map(x => x[0]) : (selectedRowsKeys = []))
  const onSelectAllClick = e => {
    selectAll_(e.target.checked)
  }
  // ============================================================================
  // ================================config =====================================
  let config = false
  const onConfigClicked = async () => {
    config = !config
  }
  const onConfigApply = e => {
    fetchConfig['columns'] = e.detail.list
    config = false
    // const e1 = [header_evt, fetchConfig] // fix this(config)
    // S.trigger([e1]) // fix this
    //resetFilter_(); onHeaderGet() will do this.
    headerColSortSettingsRow = []
    // refresh();
  }
  // ============================================================================
  // ================================model functions=============================
  let modalIsVisible = false
  let modelItem = []
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
    modelItem = []
    openModal()
  }
  // ============================================================================
  function isGlobal(v) {
    return isArray(v) ? (v.length >= 2 ? v[1] === 'global' : false) : false
  }

  let showButton = false
  let showComponent = false
  $: {
    showButton = false
    showComponent = false
    if (addnew_type == 'button') {
      showButton = true
      if (addnewform) {
        showComponent = true
      }
    } else {
      showComponent = true
    }
  }

  let showRowNum = true
  function onShowRowNum() {
    showRowNum = !showRowNum
  }
  $: colCount = headerColIsvisibleRow.filter(x => !!x).length
  $: showResetFilterButton = filterSettings.filter(x => !!x).length > 0
  $: operationsCount = 2
  // can pass null to display nothing.
  function getValue(v) {
    return isArray(v) ? v[0] || '' : v
  }
  let contextmenu = true
  let rowDoms = []

  function makeUrl(props, id) {
    if (id) {
      return new UrlPattern(props.dp).stringify({
        id,
        org: org_id,
        project: project_id
      })
    } else {
      return ''
    }
  }
  let rowNumScroll
  let scrolledRow
  function removeScrollFocus() {
    if (scrolledRow) {
      scrolledRow.classList.remove('onScrollFocus')
    }
  }
  function onRowNumChange() {
    removeScrollFocus()
    scrolledRow = rowDoms[rowNumScroll - 1]
    if (scrolledRow) {
      const offsetTop = scrolledRow.offsetTop
      window.scrollTo(0, offsetTop)
      scrolledRow.classList.add('onScrollFocus')
      setTimeout(removeScrollFocus, 1500)
    }
  }
  const org_id_ctx = getContext('org_id')
  const org_id = org_id_ctx ? get(org_id_ctx) : ''
  const project_id_ctx = getContext('project_id')
  const project_id = project_id_ctx ? get(project_id_ctx) : ''

  css_count.increase('table_context_menu')
  onDestroy(() => {
    css_count.decrease('table_context_menu')
  })
</script>

<div class="table_wrap">
  {#if addnew_pos == 't'}
    {#if showButton}
      <button
        name="table_add"
        class={addnewform ? 'pressed' : ''}
        bind:this={doms.addbutton}
        on:click={toogleAddForm}>
        {!addnewform ? 'Add New' : 'Close'}
      </button>
    {/if}
    {#if showComponent}
      <svelte:component
        this={quickcomponent}
        key={null}
        {schema_key}
        buttonlabels={addnew_labels}
        on:close={toogleAddForm}
        on:successSave={successSave} />
    {/if}
  {/if}
  <hr />
  <Error {er} />
  {#if showHeader}
    {#if showResetFilterButton}
      <button class="" on:click={onResetFilter}>Reset Filters</button>
    {/if}

    <span>{items.length}{items.length <= 1 ? ' item' : ' items'}</span>
    Page Size:
    <input
      class="w60"
      type="number"
      bind:value={limit}
      on:change={onLimitChange}
      min="0"
      title="press Enter/Tab" />
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
    <!-- <button type="button" on:click={onShowRowNum}>Row Numbers</button> -->
    {#if !IS_PRODUCTION}
      <button type="button" on:click={onConfigClicked}>Config</button>
    {/if}
    {#if config}
      <Config
        {schema_key}
        on:close={() => (config = !config)}
        on:configApply={onConfigApply} />
    {/if}
  {/if}
  {#if headerColTitlesRow.length}
    {#if authorized}
      <table>
        {#if showHeader}
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  bind:checked={allSelected}
                  on:click={onSelectAllClick} />
              </th>
              <th>No</th>
              {#each headerColTitlesRow as h, index}
                {#if headerColIsvisibleRow[index]}
                  <th
                    on:click={e => onHandleSort(e, index)}
                    on:contextmenu|preventDefault={e => onHeaderContext(e, index)}>
                    {h}
                    {#if headerColSortSettingsRow[index] === 0}
                      ▲
                    {:else if headerColSortSettingsRow[index] === 1}
                      ▼
                    {:else}
                      <!-- content here -->
                    {/if}
                  </th>
                {/if}
              {/each}
              <th colspan={operationsCount}>Actions</th>
              <!-- <th width="100px">Actions</th> -->
            </tr>
            <tr>
              <th />
              {#if showRowNum}
                <th>
                  <input
                    type="number"
                    class="w60"
                    bind:value={rowNumScroll}
                    min="1"
                    max={items.length}
                    on:change={onRowNumChange} />
                </th>
              {/if}
              {#each headerColTitlesRow as h, index}
                {#if headerColIsvisibleRow[index]}
                  {#if headerColCustomFilter[index]}
                    <th>
                      <select
                        bind:value={filterSettings[index]}
                        on:change={onHandleFilter(index)}>
                        {#each headerColCustomFilter[index] as f}
                          <option value={f[1]}>{f[0]}</option>
                        {/each}
                      </select>
                    </th>
                  {:else if headerColTypesRow[index] === DisplayType.Number || headerColTypesRow[index] === DisplayType.Text || headerColTypesRow[index] === DisplayType.Double || headerColTypesRow[index] === DisplayType.Url}
                    <th>
                      <input
                        type="search"
                        placeholder=" &#128269;"
                        bind:value={filterSettings[index]}
                        on:input={onHandleFilter(index)}
                        on:contextmenu|preventDefault={e => onTextInputContext(e, index)} />
                    </th>
                  {:else if headerColTypesRow[index] === DisplayType.Checkbox}
                    <th>
                      <input
                        type="checkbox"
                        bind:checked={filterSettings[index]}
                        on:change={onHandleFilter(index)}
                        on:contextmenu|preventDefault={e => onTextInputContext(e, index)} />
                    </th>
                  {:else if headerColTypesRow[index] === DisplayType.DateTime}
                    <th>Date</th>
                    <!-- {:else if headerColTypesRow[index] === DisplayType.Url}
                    <th /> -->
                  {:else if headerColTypesRow[index] === DisplayType.Color}
                    <th />
                  {:else}
                    <th>Unknown Type {headerColTypesRow[index]}</th>
                  {/if}
                {/if}
              {/each}
              <th colspan={operationsCount}>
                <!-- <th width="100px"></th> -->
              </th>
            </tr>

          </thead>
        {/if}
        <tbody>
          {#each items as r, rowIndex (getValue(r[0]))}
            <tr
              bind:this={rowDoms[rowIndex]}
              class={selectedRowsKeys.includes(getValue(r[0])) ? $css.table.classes.selected || 'selected' : ''}
              in:fade={{ y: 200, duration: 100 }}>
              <td>
                {#if !isGlobal(r[0])}
                  {#if false}
                    <span>ID: {getValue(r[0])}</span>
                  {/if}
                  <input
                    type="checkbox"
                    value={getValue(r[0])}
                    checked={selectedRowsKeys.includes(getValue(r[0]))}
                    on:click={onSelectRowClick} />
                {/if}
              </td>
              {#if showRowNum}
                <td>{rowIndex + 1}</td>
              {/if}
              {#each r as c, index}
                {#if headerColIsvisibleRow[index]}
                  <td>
                    {#if headerColEditableRow[index]}
                      <GeneralForm
                        {schema_key}
                        key={getValue(r[0])}
                        {fetchConfig}
                        selector={['_key', headerColEditableRow[index].s]}
                        id="inline"
                        buttonlabels={{ save: 'Save', cancel: '' }}
                        headerSchema={[[[[], [FormType.hidden, headerColEditableRow[index].t], [], [], [], {}], {}], { r: { result: [[getValue(r[0]), getValue(c)]] } }]} />
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
                  </td>
                {/if}
              {/each}
              {#if !isGlobal(r[0])}
                <td>
                  {#if !isGlobal(r[0])}
                    {#if quickcomponent && !quickViewKeys.includes(getValue(r[0]))}
                      <svg
                        tabindex="0"
                        on:keypress={e => {
                          if (e.keyCode == 13 || e.which == 13) {
                            quickViewKeys.push(getValue(r[0]))
                            quickViewKeys = quickViewKeys
                          }
                        }}
                        name="edit"
                        key={getValue(r[0])}
                        type="button"
                        on:click={() => {
                          quickViewKeys.push(getValue(r[0]))
                          quickViewKeys = quickViewKeys
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3
                          17.25zM20.71 7.04c.39-.39.39-1.02
                          0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83
                          3.75 3.75 1.83-1.83z" />
                        <path d="M0 0h24v24H0z" fill="none" />
                      </svg>
                    {/if}
                  {/if}
                </td>
                <td>
                  {#if !isGlobal(r[0])}
                    <svg
                      tabindex="0"
                      on:keypress={e => {
                        if (e.keyCode == 13 || e.which == 13) {
                          onDeleteRow(getValue(r[0]), rowIndex)()
                        }
                      }}
                      name="delete"
                      key={getValue(r[0])}
                      type="button"
                      on:click={e => onDeleteRow(getValue(r[0]), rowIndex)()}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24">
                      <path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19
                        4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                  {/if}
                </td>
              {/if}
              <!-- <td> -->

              {#if false}
                <a href="javascript:;" on:click={() => onItemClick(r)}>
                  <span class="icon is-small">
                    <i class="fas fa-edit" />
                    edit
                  </span>
                </a>

                <a href="javascript:;" on:click={() => onDeleteClick(r)}>
                  <span class="icon is-small">
                    <i class="fas fa-trash" />
                    delete
                  </span>
                </a>
              {/if}
              <!-- </td> -->
            </tr>
            {#if quickViewKeys.includes(getValue(r[0]))}
              <tr>
                <td colspan={colCount + (showRowNum ? 1 : 0) + 3}>
                  {#if quickcomponent}
                    <svelte:component
                      this={quickcomponent}
                      bind:this={rowEditDoms[rowIndex]}
                      key={getValue(r[0])}
                      {schema_key}
                      {fetchConfig}
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
    {/if}
    <Error {er} />
    {#if addnew_pos == 'b'}
      {#if showButton}
        <button
          name="table_add"
          class={addnewform ? 'pressed' : ''}
          bind:this={doms.addbutton}
          on:click={toogleAddForm}>
          {!addnewform ? 'Add New' : 'Close'}
        </button>
      {/if}
      {#if showComponent}
        <svelte:component
          this={quickcomponent}
          key={null}
          {schema_key}
          buttonlabels={addnew_labels}
          on:close={toogleAddForm}
          on:successSave={successSave} />
      {/if}
    {/if}
    {#if contextmenu}
      <div class="menu">
        <div
          class="menu-item"
          on:click={e => onHandleSort(e, headerMenuColumn, 0)}>
          Sort Ascending
        </div>
        <div
          class="menu-item"
          on:click={e => onHandleSort(e, headerMenuColumn, 1)}>
          Sort Descending
        </div>
        <div
          class="menu-item"
          on:click={e => onHandleSort(e, headerMenuColumn, null)}>
          No Sorting
        </div>
        <hr />
        <div class="menu-item" on:click={closeHeaderMenu}>Close</div>
      </div>
      <div class="menu-input">
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
        <hr />
        <div class="menu-item" on:click={closeInputMenu}>Close</div>
      </div>
    {/if}
    {#if modalIsVisible}
      <Modal on:close={closeModal}>
        <header slot="header">
          <button class="" aria-label="close" on:click={closeModal}>X</button>
        </header>
        <svelte:component
          this={modelcomponent}
          on:close={closeModal}
          on:successSave={refresh}
          {headerColTitlesRow}
          {items} />
      </Modal>
    {/if}
  {/if}
  {#if isLoading}
    <Skeleton />
  {/if}
</div>
