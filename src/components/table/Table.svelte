<script lang='ts'>
  // import * as _ from "lamb";
  import * as R from 'ramda'
  import * as RA from 'ramda-adjunct'
  import Row from './Row.svelte'
  import Header from './Header.svelte'
  import { onMount, onDestroy, createEventDispatcher, setContext, tick, getContext, get,
   S, ws_connected, event_type, events as e, fade, fly, form_type, DisplayType, Unique } from '../../modules/functions.ts'
  import { project_data } from '../../modules/global_stores/project.ts'
  import {schemaEvents} from '../../modules/schema_events.ts'
  import Pagination from './Pagination.svelte'
  import AddForm from './AddForm.svelte'
  import ContextMenu from './ContextMenu.svelte'

  const dp = createEventDispatcher()
  import { css } from '../../modules/global_stores/css.ts'
  import { default_filter } from '../../modules/global_stores/default_filter.ts'
  // import Card from "../components/Card.svelte";
  import Modal from './Model.svelte'
  import Config from './Config.svelte'

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

  export let pass = [] // [["context", "org_data", "_key", "org"]]

  $: {
    setContext('items', items)
  }

  // headers
  let headerVisibleColTypesRow = []
  let headerIsvisibleColumnsRow = []
  let headerColumnPropsRow = []


  let options = {}

  //internal:
  const hiddenColumns = [DisplayType.ARRAY, DisplayType.OBJECT, DisplayType.BINARY]
  let filterSettings = []
  let sortSettings = []
  let quickview = []
  let selectedRowsKeys = []
  let first_visibile_column = 0
  let fetchConfig = { type: form_type.array } // also set level latter
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

  let data_evt
  let unsub
  let mutate_evt

  function setPass() {
    if(Array.isArray(pass)) {
      for(let i = 0; i < pass.length ; i++){
        if(Array.isArray(pass[i]) && pass[i].length > 0){
          let e = pass[i]
          console.log(e)
          if(Array.isArray(e) && e.length > 0){
            const func = e[0]
            console.log('11',func)
            if(typeof func == 'string') {
              if(func == 'context'){
                if(e.length > 1){
                  const key = e[1]
                  const data = get(getContext(key))
                  let addKey
                  if(e.length > 2){
                    addKey = e[2]
                  } else {
                    addKey = key
                  }
                  fetchConfig[addKey] = data
                  continue
                }
              } else if(func == 'contextKey'){
                console.log(123)
                if(e.length > 1){
                  const key = e[1]
                  let objKey
                  if(e.length > 2){
                    objKey = e[2]
                  } else {
                    objKey = "_key"
                  }
                  let addKey
                  if(e.length > 3){
                    addKey = e[3]
                  } else {
                    addKey = key
                  }
                  const data = get(getContext(key))[objKey]
                  console.log('data is: ', data)
                  fetchConfig[addKey] = data
                  console.log('fetchConfig', fetchConfig)
                  continue
                }
              } else if(func == 'contextKeyInArray'){
                if(e.length > 1){
                  const key = e[1]
                  let objKey
                  if(e.length > 2){
                    objKey = e[2]
                  } else {
                    objKey = "_key"
                  }
                  console.log(key)
                  console.log(getContext(key))
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
  $: query, requiredFilter, schema_key, reset()

  function unRegister() {
    unsub && S.trigger([[unsub, {}]])
    events && S.unbind_(events)
  }
  // Note reset() function executed before fetch
  function reset() {
    if(!schema_key){
      console.warn('schema key is invalid in table')
    }
    unRegister()
    events = schemaEvents(Unique.id, schema_key)
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
    fetchConfig = {...fetchConfig, type: form_type.array } //  level: $project_data[$project_data.length - 1]?._key ?? "" Fix Lavel not working..
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

    data_evt = events[0]
    unsub = [event_type.unsubscribe, ...events[0].slice(1)]
    mutate_evt = events[1]
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
  function onDataGet(all) {
    //console.warn(all)
    const [[h, d]] = all
    if(h.length) {
      fillHeadersArray(h)
    }
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
      if (d[0]) {
        deleteRows_([key])
      } else {
        alert(d[1])
      }
    }
  }
  const onDeleteSelected = async () => {
    const r = confirm('Are You Sure to delete selected rows?')
    if (r == true) {
      mutate_evt.pop()
      mutate_evt.push(Unique.id)

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
      if (d[0]) {
        deleteRows_(selectedRowsKeys)
      } else {
        alert(d[1])
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
  const onHandleSort = (e, col) => {
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
    // const e1 = [header_evt, fetchConfig] // fix this(config)
    // S.trigger([e1]) // fix this
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
  function isGlobal(v) {
    //return v?.[1] == 'global'
    if(RA.isArray(v)) {
      if(v.length >= 2) {
        return v[1] === 'global'
      }
    }
    return false
  }

  function onShowRowNum() {
    showRowNum = !showRowNum
  }
  $: mergeRowsCount = 3 + (showRowNum ? 1 : 0);

  function getValue(v) {
    if(RA.isArray(v)) {
      if(v.length > 0) {
        return v[0]
      } else {
        // console.log("Array Must has one element", schema_key, v)
        return v
        // can pass null to display nothing.
      }
    } else {
      return v
    }
  }
</script>


{#if $css.table}
<div>

  <AddForm
    {toogleAddForm}
    {doms}
    {addnewform}
    {quickcomponent}
    {schema_key}
    {successSave}
  />
  <hr />

  {er}
  <button class="" on:click={onResetFilter}>Reset Filters</button>
  <Pagination
    {items}
    {limit}
    {current_page}
    {total_pages}
    {onLimitChange}
    {refresh}
    {pages}
  />
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
      <Header
          {mergeRowsCount}
          {allSelected}
          {onSelectAllClick}
          {headerTitlesRow}
          selected={false}
          {headerIsvisibleColumnsRow}
          {headerVisibleColTypesRow}
          {sortSettings}
          {customFilter}
          {filterSettings}
          {hiddenColumns}
          {onHeaderContext}
          {onHandleFilter}
          {onTextInputContext}
          {onHandleSort}
      />
    </thead>
    <tbody>
      {#each items as l, cindex (getValue(l[0]))}
        <Row 
          selected={selectedRowsKeys.includes(getValue(l[0]))}
          {showRowNum}
          rowNum={cindex + 1}
          isGlobal={isGlobal(l[0])}
          rowValue={l}
          {headerIsvisibleColumnsRow}
          {headerVisibleColTypesRow}
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
        />
      {/each}
    </tbody>
  </table>
</div>
<ContextMenu
  {contextmenu}
  {modalIsVisible}
  {closeModal}
  {modelcomponent}
  {refresh}
  {headerTitlesRow}
  {items}
/>
{/if}