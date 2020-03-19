<script lang='ts'>
//TODO fix table row hightlight not working properly when some row is deleted.
// Add Two modes on button press change classes
// Instead of alter show model on delete
  // import * as _ from "lamb";
  import { view, lensPath } from 'ramda'
  import { isArray } from 'ramda-adjunct'
  import Row from './Row.svelte'
  import Header from './Header.svelte'
  import { onMount, onDestroy, createEventDispatcher, getContext, setContext, tick } from 'svelte'
  import { get, writable } from 'svelte/store'
  import { S, ws_connected } from '../../ws_events_dispatcher'
  import { ET, E, schemaEvents } from '../../events'
  import { fade, fly } from 'svelte/transition'
  import { ValueType, DisplayType } from '../../enums'
   declare let $ws_connected
  import { translation } from '../../translation'
  declare let $translation
  import Pagination from './Pagination.svelte'
  import AddForm from './AddForm.svelte'
  import ContextMenu from './ContextMenu.svelte'
  import Error from '../UI/Error.svelte'
  import Skeleton from '../UI/Skeleton.svelte'
  const dp = createEventDispatcher()
  import { css_count } from '../../css'
  // import Card from "../components/Card.svelte";
  import Config from './Config.svelte'
  import { getNotificationsContext } from '../../../thirdparty/svelte-notifications/src/index'
  const { addNotification } = getNotificationsContext();
  export let customFilter = {}
  export let requiredFilter = {} // always add this filter when fetch
  export let modelcomponent = false
  export let quickcomponent = false
  export let query = {limit: 0, page: 1} // To get arguments from ?limit=25&page=2
  export let schema_key = ''
  export let pass = [] // [["context", "org_data", "_key", "org"]]
  let events = schemaEvents(schema_key)
  let headerTitlesRow = []
  let items = []
  let count = 0
  $: {setContext('items', items) }
  let project = getContext('project')
  let project_ctx = writable([])
  if(project) {$project_ctx = get(project) }
  declare let $project_ctx
  // headers
  let headerVisibleColTypesRow = []
  let headerIsvisibleColumnsRow = []
  let sortSettingsRow = []
  let editableColumnsRow = []
  let headerColumnPropsRow = []
  let options = {}
  //internal:
  const hiddenColumns = []
  let filterSettings = []
  let quickview = []
  let selectedRowsKeys = []
  let first_visibile_column = 0
  let fetchConfig = { type: ValueType.Array, project: $project_ctx?.[$project_ctx.length - 1]?._key ?? null } 
  // pagination:
  let limit = Number(query.limit) || 0
  let pages = [1, 2]
  let current_page = Number(query.page) || 1
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
  let contextmenu = true
  let showRowNum = true
  let rowEditDoms = []
  let rowDoms = []
  let addnew_pos = "t"
  let addnew_type = "button"
  let addnew_labels = {save: "Save", cancel : "Cancel"}
  let rowType = "table"
  let showHeader = true;

  if(!events) console.warn('events array must be defined')
  const uid = S.uid
  let data_evt = [ET.subscribe, events[0], uid]
  let unsub_evt = [ET.unsubscribe, events[0], uid]
  
  let authorized = true

  function setPass() {
    if(Array.isArray(pass)) {
      for(let i = 0; i < pass.length ; i++){
        if(Array.isArray(pass[i]) && pass[i].length > 0){
          let e = pass[i]
          if(Array.isArray(e) && e.length > 0){
            const func = e[0]
            if(typeof func == 'string') {
              if(func == 'context'){
                if(e.length > 1){
                  const key = e[1]
                  const data = get(getContext(key))
                  let addKey = e.length > 2 ? e[2] : key
                  fetchConfig[addKey] = data
                  continue
                }
              } else if(func == 'contextKey'){
                if(e.length > 1){
                  const key = e[1]
                  let objKey = e.length > 2 ? e[2] : "_key"
                  let addKey = e.length > 3 ? e[3] : key
                  const data = get(getContext(key))[objKey]
                  fetchConfig[addKey] = data
                  continue
                }
              } else if(func == 'contextKeyInArray'){
                if(e.length > 1){
                  const key = e[1]
                  let objKey = e.length > 2 ? e[2] : "_key"
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
  // customFilter, not work with filter..
  //$: (query); (requiredFilter); (schema_key); reset()
  function unRegister() {
    unsub_evt && S.trigger([[unsub_evt, {}]])
    events && S.unbind_(events)
  }
  if(!schema_key){console.warn('schema key is invalid in table') }

  css_count.increase('table')
  onMount(() => {mounted = true })
  onDestroy(() => {
      unRegister();
      css_count.decrease('table')
  })
  const runOnce = () => {
    if (!binded) {
      {
        S.bind$(data_evt, onDataGet, 1)
        //S.bind$(header_evt, onHeaderGet, 1)
        //if(header_evt) {
          //const e1 = [header_evt, fetchConfig]
          //S.trigger([e1])
        //}
      }
      //binded = true
    }
  }
  const onWSConnect = () => {
    //if (headerFetched) {
      refresh()
    //}
  }
  // this function send subscription request everytime ws connection open
  $: {
    (binded)
    if (mounted) {
      if ($ws_connected) {
        runOnce()
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
      sortSettingsRow,
      [limit, 0, current_page],
      fetchConfig,
    ]
    const e1 = [data_evt, args]
    S.trigger([e1])
  }
  // =============================================================================
  // ================================On Headers and Data Receive =================
  // delete this function
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
    sortSettingsRow = d[3] ?? []
    editableColumnsRow = d[4] ?? []
    headerColumnPropsRow = d[5] ?? []
    let i
    for (i = 0; i < headerIsvisibleColumnsRow.length; i++) {
      if (headerIsvisibleColumnsRow[i]) {
        first_visibile_column = i
        break
      }
    }
    options = d[6]
    addnew_pos = options?.add?.pos ?? "t"
    addnew_type = options?.add?.type ?? "button"
    const l = options?.add?.l
    if(l){addnew_labels = l }
    showHeader = options?.table?.header ?? true
    rowType = options?.table?.row ?? "table"
    resetFilter_() // Take care....
  }
  function dropNotExisting(a1: string[], b1:string[]) {
    // if a1 not contains element in b1 remove it from a1 and return it.
    let newa1 = []
    for(let x of a1){
      const idx = b1.indexOf(x)
      // if(idx == -1){a1.splice(idx, 1) } } // cant modify array in loop
      if(idx != -1) {newa1.push(x) }
    }
    return newa1
  }
  function onDataGet(all) {
    const [h, d] = all;
    if (h === false){
      authorized = false
      er = d
    }
    if(h.length) {fillHeadersArray(h) }
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
        const findIndex = items.findIndex(i => {return i[0] == mod[0] })
        if (findIndex !== -1) {
          // start, ?deleteCount, ...items
          items.splice(findIndex, 1, mod)
        }
      })
      items = items
    } else if (d.d) {deleteRows_(d.d) }
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
    if(addnew_type == "button"){
      addnewform = !addnewform
      if(doms.addbutton){
        doms.addbutton.focus()
      } else {
        console.warn('no dom for add button!')
      }
    }
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
    if (isFind) {quickview = quickview }
  }
  const editButtonFocus = async(key) => {
    await tick();
    const element: HTMLElement | null = document.querySelector(`button[key='${key}'][name='edit']`);
      if(element) {
        element.focus()
      }
  }
  const successSave = e => {
    if (e.detail.key === null) {toogleAddForm() } else {
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
  const onDeleteRow = (key, rowIdx) => async () => {
    const r = confirm('Are You Sure?')
    if (r == true) {
      const mutate_evt = [ET.delete_, events[1], key]
      const filter = [`="${key}"`]
      const d = await new Promise((resolve, reject) => {
        // send unsubscribe event if edit is open
        const args = ['DEL', filter, fetchConfig]
        if(rowEditDoms[rowIdx]){
          const unsu_event = rowEditDoms[rowIdx]?.f?.unsub_evt ?? null
          if(unsu_event){args.push(unsu_event) }
        }
        S.bindT(mutate_evt, d => {resolve(d) }, args )
      })
      if (d[0]) {
        const delete_msg = view(lensPath(['msg', 'delete']), $translation);
        addNotification({
            text: delete_msg,
            position: 'bottom-center',
          })
        deleteRows_([key])
      } else {alert(d[1]) }
    }
  }
  const onDeleteSelected = async () => {
    const r = confirm('Are You Sure to delete selected rows?')
    if (r == true) {
      const mutate_evt = [ET.delete_, events[1], S.uid]
      const filter = [JSON.stringify(selectedRowsKeys)]
      const d = await new Promise((resolve, reject) => {
        S.bindT(mutate_evt, d => {resolve(d) }, ['DEL', filter] )
      })
      d[0] ? deleteRows_(selectedRowsKeys) : alert(d[1])
    }
  }
  // ============================================================================
  // ================================Pagination==================================
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
      for (let i = 1; i <= total_pages; i++) {arr.push(i) }
      pages = arr
      if (!pages.includes(current_page)) {current_page = 1 }
    }
    //console.log(count, limit, total_pages, pages, current_page)
  }
  const onLimitChange = () => {
    calc_pagination()
    refresh()
    //note: after refresh calc_pagination() will be called again.
  }
  // ============================================================================
  // ================================Sorting=====================================
  const onHandleSort = (e, col, order) => {
    if (e.ctrlKey) {
    } else {
      if(order !== undefined){
        sortSettingsRow = []
        sortSettingsRow[col] = order
        closeHeaderMenu()
      } else {      
        const sortOrder = sortSettingsRow[col]
        sortSettingsRow = []
        if (sortOrder === null || sortOrder === undefined) {
          sortSettingsRow[col] = 0
        } else if (sortOrder === 0) {
          sortSettingsRow[col] = 1
        } else {
          sortSettingsRow[col] = null
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
  function onItemClick(litem) {dp('onItemClick', {item: litem, }) }
  function onDeleteClick(litem) {dp('onDeleteClick', {item: litem, }) }
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
    const menuBox: HTMLElement | null = window.document.querySelector('.menu-input')
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
    if (headerMenuDisplayed == true) {menuBox.style.display = 'none'}
  }
  const closeInputMenu = () => {
    const menuBox: HTMLElement | null = window.document.querySelector('.menu-input')
    if (inputheaderMenuDisplayed == true) {menuBox.style.display = 'none'}
  }
  // ============================================================================
  // ================================multiple select=============================
  let allSelected
  let multipleSelected
  $: allSelected = selectedRowsKeys.length == items.length ? true : false
  $: multipleSelected = selectedRowsKeys.length ? true : false

  const onSelectRowClick = e => {
    const index = selectedRowsKeys.findIndex(x => e.target.value == x)
    index > -1 ? selectedRowsKeys.splice(index, 1) : selectedRowsKeys.push(e.target.value)
    selectedRowsKeys = selectedRowsKeys
    //e.preventDefault();
    //e.stopPropagation();
  }
  const selectAll_ = (v: boolean) => selectedRowsKeys = v ? items.map(x => x[0]) : selectedRowsKeys = []
  const onSelectAllClick = e => {selectAll_(e.target.checked) }
  // ============================================================================
  // ================================config =============================
  const onConfigClicked = async () => {config = !config }
  const onConfigApply = e => {
    fetchConfig['columns'] = e.detail.list
    config = false
    // const e1 = [header_evt, fetchConfig] // fix this(config)
    // S.trigger([e1]) // fix this
    //resetFilter_(); onHeaderGet() will do this.
    sortSettingsRow = []
    // refresh();
  }
  // ============================================================================
  // ================================model functions=============================
  // function onItemClick(litem) {
  //   item = litem;
  //   openModal();
  // }
  function closeModal() {modalIsVisible = false }
  function openModal() {modalIsVisible = true }
  function onNewClick() {item = []; openModal(); }
  // ============================================================================
  function isGlobal(v) {return isArray(v) ? (v.length >= 2 ? v[1] === 'global' : false) : false }
  function onShowRowNum() {showRowNum = !showRowNum }
  let mergeRowsCount
  $: mergeRowsCount = 3 + (showRowNum ? 1 : 0);
    // can pass null to display nothing.
  function getValue(v) {return isArray(v) ?  v[0] || '' : v }
</script>
<div class='table_wrap'>
  {#if addnew_pos == "t"}
    <AddForm
      {toogleAddForm}
      {doms}
      {addnewform}
      {quickcomponent}
      {schema_key}
      {successSave}
      {addnew_type}
      {addnew_labels}
    />
  {/if}
  <hr >
<Error {er} />
{#if showHeader}
  <button class="" on:click={onResetFilter}>Reset Filters</button>
  <Pagination
    {items}
    bind:limit={limit}
    bind:current_page={current_page}
    {total_pages}
    {onLimitChange}
    {refresh}
    {pages}
  />
  {#if multipleSelected} <button type="button" on:click={onDeleteSelected}>Delete</button> {/if}
  <button type="button" on:click={onShowRowNum}>Row Numbers</button>
  <button type="button" on:click={onConfigClicked}>Config</button>
  {#if config}
    <Config
      {schema_key}
      on:close={() => (config = !config)}
      on:configApply={onConfigApply} />
  {/if}
{/if}
{#if headerTitlesRow.length}
  {#if authorized}
    <table>
      {#if showHeader}
        <thead>
          <Header
              {mergeRowsCount}
              {allSelected}
              {onSelectAllClick}
              {headerTitlesRow}             
              {headerIsvisibleColumnsRow}
              {headerVisibleColTypesRow}
              {sortSettingsRow}
              {customFilter}
              {filterSettings}
              {hiddenColumns}
              {onHeaderContext}
              {onHandleFilter}
              {onTextInputContext}
              {onHandleSort}
              {showRowNum}
              {rowDoms}
              {items}
          />
        </thead>
      {/if}
      <tbody>
        {#each items as l, cindex (getValue(l[0]))}
          <Row 
            selected={selectedRowsKeys.includes(getValue(l[0]))}
            {showRowNum}
            rowIndex={cindex}
            isGlobal={isGlobal(l[0])}
            rowValue={l}
            {headerIsvisibleColumnsRow}
            {headerVisibleColTypesRow}
            {editableColumnsRow}
            {headerColumnPropsRow}
            {selectedRowsKeys}
            {onSelectRowClick}
            {onItemClick}
            {onDeleteClick}
            {onDeleteRow}
            bind:quickview={quickview}
            showQuickView={quickview.includes(getValue(l[0]))}
            {quickcomponent}
            {schema_key}
            {onCancel}
            {successSave}
            {deleteRow}
            {getValue}
            {fetchConfig}
            {rowEditDoms}
            {rowDoms}
          />
        {/each}
      </tbody>
    </table>
  {:else}
    <Error {er} />
  {/if}
  {#if addnew_pos == "b"}
    <AddForm
      {toogleAddForm}
      {doms}
      {addnewform}
      {quickcomponent}
      {schema_key}
      {successSave}
      {addnew_type}
      {addnew_labels}
    />
  {/if}
  <ContextMenu
    {closeHeaderMenu}
    {contextmenu}
    {modalIsVisible}
    {closeModal}
    {modelcomponent}
    {refresh}
    {headerTitlesRow}
    {items}
    {closeInputMenu}
    {onHandleSort}
    {headerMenuColumn}
    {inputHeaderMenuColumn}
  />
{:else}
  <Skeleton/>
{/if}
</div>