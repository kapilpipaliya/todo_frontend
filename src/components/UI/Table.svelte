<script context="module">
  document.body.ondrop = function(event) {
    event.preventDefault();
    event.stopPropagation();
  };
</script>

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
  import { onMount, onDestroy, createEventDispatcher, getContext, tick } from 'svelte';
  import { view, lensPath, all, equals } from 'ramda';
  import { isArray } from 'ramda-adjunct';
  import { get, writable } from 'svelte/store';
  import { Ws, ws_connected } from '../../ws_events_dispatcher';
  import { isEmpty } from 'ramda';
  import { clone } from 'rambda';
  import { is_production, ET, E, schemaEvents, SortDirection, ValueType, FormType, DisplayType } from '../../enums';
  declare let $is_production;
  declare let $ws_connected;
  import { translation } from '../../translation';
  declare let $translation;
  import Modal from '../UI/Model.svelte';
  import Error from '../UI/Error.svelte';
  import Skeleton from '../UI/Skeleton.svelte';
  import { css_loading, css, css_count } from '../../css';
  declare let $css_loading;
  // import Card from "../components/Card.svelte";
  import Config from './Config.svelte';
  import { getNotificationsContext } from '../../../thirdparty/svelte-notifications/src/index';

  import UrlPattern from 'url-pattern';
  import Text from './display/Text.svelte';
  import Bool from './display/Bool.svelte';
  import Url from './display/Url.svelte';
  import Color from './display/Color.svelte';
  import Time from './display/Time.svelte';
  import GeneralForm from '../form/Index.svelte';
  import Column from './table/Column.svelte';
  import Row from './table/Row.svelte';

  export let modelcomponent = false;
  export let quickcomponent = false;
  export let schema_key = '';
  export let pass = []; // [["context", "org_data", "_key", "org"]]
  export let query = { limit: 0, page: 1 }; // To get arguments from ?limit=25&page=2
  export let requiredFilter = []; // always add this filter when fetch // used when showing custom table
  export let fetchConfig = {};
  export let syncQueryParams = true;

  css_count.increase('table');
  let project = getContext('project');
  let project_ctx = project ? get(project) || [] : [];
  fetchConfig = { ...fetchConfig, type: ValueType.Array, project: project_ctx?.[project_ctx.length - 1]?._key ?? null };
  function setPass() {
    if (Array.isArray(pass)) {
      for (let i = 0; i < pass.length; i++) {
        if (Array.isArray(pass[i]) && pass[i].length > 0) {
          let e = pass[i];
          if (Array.isArray(e) && e.length > 0) {
            const func = e[0];
            if (typeof func == 'string') {
              if (func == 'context') {
                if (e.length > 1) {
                  const key = e[1];
                  const data = get(getContext(key));
                  let addKey = e.length > 2 ? e[2] : key;
                  fetchConfig[addKey] = data;
                  continue;
                }
              } else if (func == 'contextKey') {
                if (e.length > 1) {
                  const key = e[1];
                  let objKey = e.length > 2 ? e[2] : '_key';
                  let addKey = e.length > 3 ? e[3] : key;
                  const data = get(getContext(key))[objKey];
                  fetchConfig[addKey] = data;
                  continue;
                }
              } else if (func == 'contextKeyInArray') {
                if (e.length > 1) {
                  const key = e[1];
                  let objKey = e.length > 2 ? e[2] : '_key';
                  pass[i] = [get(getContext(key))[objKey]];
                  continue;
                }
              }
            }
          }
        }
      }
    }
  }
  setPass();

  /*==============================
  =            filter            =
  ==============================*/
  let filterSettings = query.filter ? JSON.parse(query.filter) : [];
  const delay_refresh = () => {
    // when filter applied, change current_page to 1 before fetching data, to prevent
    // empty result
    current_page = 1;
    refresh();
  };
  //store the timeout, cancel it on each change, then set a new one
  let filter_timeout;
  const onHandleFilter = col => event => {
    clearTimeout(filter_timeout);
    filter_timeout = setTimeout(delay_refresh, 250);
  };
  const resetFilter_ = () => {
    const array = new Array(headerColTitlesRow.length);
    array.fill(null);
    for (let key in requiredFilter) {
      array[key] = requiredFilter[key];
    }
    filterSettings = array;
  };
  const onResetFilter = event => {
    resetFilter_();
    refresh();
  };
  /*=====  End of filter  ======*/

  /*==================================
  =            Pagination            =
  ==================================*/
  let limit = Number(query.limit) || 0;
  let pages = [1, 2];
  let current_page = Number(query.page) || 1;
  let total_pages = Math.max(current_page, 1);
  let count = 0;
  const calc_pagination = () => {
    //console.log(count, limit, total_pages, pages, current_page)
    if (limit <= 0) {
      limit = 0;
      total_pages = 1;
      pages = [1];
      current_page = 1;
    } else {
      total_pages = Math.ceil(count / limit);
      const arr = [];
      for (let i = 1; i <= total_pages; i++) {
        arr.push(i);
      }
      pages = arr;
      if (!pages.includes(current_page)) {
        current_page = 1;
      }
    }
    //console.log(count, limit, total_pages, pages, current_page)
  };
  const onLimitChange = () => {
    calc_pagination();
    refresh();
    //note: after refresh calc_pagination() will be called again.
  };
  /*=====  End of Pagination  ======*/

  /*=====================================
  =            Re Fetch Data            =
  =====================================*/
  let er = '';
  if (!schema_key) {
    er = 'schema key is invalid in table';
  }
  let events = schemaEvents(schema_key);
  if (!events) er = 'events array must be defined';
  const uid = Ws.uid;
  let data_evt = [ET.subscribe, events[0], uid];
  let unsub_evt = [ET.unsubscribe, events[0], uid];
  let drag_evt = [ET.changePosition, events[1], uid];
  let mounted = false;
  onMount(() => {
    mounted = true;
  });
  onDestroy(() => {
    unsub_evt && Ws.trigger([[unsub_evt, {}]]);
    events && Ws.unbind_(events);
    css_count.decrease('table');
  });
  Ws.bind$(data_evt, onDataGet, 1);
  const onWSConnect = () => {
    refresh();
  };
  $: {
    if (mounted) {
      if ($ws_connected) {
        er = '';
        onWSConnect();
      } else {
        er = 'Reconnecting...';
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
    return f;
  }
  export const refresh = () => {
    const args = [mergeFilter(filterSettings), headerColSortSettingsRow, [limit, 0, current_page], fetchConfig];
    const e1 = [data_evt, args];
    Ws.trigger([e1]);
  };
  /*=====  End of Re Fetch Data  ======*/

  /*===================================================
  =            On Headers and Data Receive            =
  ===================================================*/
  let items = [];
  let addnew_pos = 't';
  let addnew_type = 'button';
  let addnew_labels = { save: 'Save', cancel: 'Cancel' };
  let rowType = 'table';
  let showHeader = true;
  // delete this function
  let headerFetched = false;
  const onHeaderGet = ([d]) => {
    fillHeadersArray(d);
    refresh();
    headerFetched = true;
  };
  let headerColTitlesRow = [];
  let headerColTypesRow = [];
  let headerColIsvisibleRow = [];
  let headerColSortSettingsRow = [];
  let headerColEditableRow = [];
  let headerColPropsRow = [];
  let headerColCustomFilter = []; // Todo Make it set by backend
  let headerColWidthRow = [];
  let options = {};
  let first_visibile_column = 0;
  let authorized = true;
  let selectedRowsKeys = [];
  let expandedRowsKeys = [];
  const fillHeadersArray = d => {
    // see getJsonHeaderData() on server:
    headerColTitlesRow = d[0] ?? [];
    headerColTypesRow = d[1] ?? [];
    headerColIsvisibleRow = d[2] ?? [];
    headerColSortSettingsRow = query.sort ? JSON.parse(query.sort) : d[3] ?? [];
    headerColEditableRow = d[4] ?? [];
    headerColPropsRow = d[5] ?? [];
    options = d[6];
    const addKeyToHiddenList = (k) => {
      const keyIdx = headerColTitlesRow.findIndex(x => x === k);
      if (keyIdx > -1) {
        headerColIsvisibleRow[keyIdx] = 0;
      }
    }
    if ($is_production && !options.k) {
      addKeyToHiddenList('Key')
      addKeyToHiddenList('Rev')
    }
    let i;
    for (i = 0; i < headerColIsvisibleRow.length; i++) {
      if (headerColIsvisibleRow[i]) {
        first_visibile_column = i;
        break;
      }
    }

    addnew_pos = options?.add?.pos ?? 't';
    addnew_type = options?.add?.type ?? 'button';
    const l = options?.add?.l;
    if (l) {
      addnew_labels = l;
    }
    showHeader = options?.table?.header ?? true;
    rowType = options?.table?.row ?? 'table';
    // resetFilter_() // Take care.... why this is needed?
  };
  function dropNotExisting(a1: string[], b1: string[]) {
    // if a1 not contains element in b1 remove it from a1 and return it.
    let newa1 = [];
    for (let x of a1) {
      const idx = b1.indexOf(x);
      // if(idx == -1){a1.splice(idx, 1) } } // cant modify array in loop
      if (idx != -1) {
        newa1.push(x);
      }
    }
    return newa1;
  }
  let isLoading = true;
  function updateModifiedRow(newData) {
    newData.forEach(mod => {
      const findIndex = items.findIndex(i => {
        return getValue(i[0]) == getValue(mod[0]);
      });
      if (findIndex !== -1) {
        // start, ?deleteCount, ...items
        items.splice(findIndex, 1, mod);
      }
    });
  }
  const doLocalSorting = () => {
    const col = headerColSortSettingsRow.findIndex(x => x == SortDirection.Ascending || x == SortDirection.Descending);
    if (col == -1) {
      return;
    }
    if (headerColSortSettingsRow[col] == SortDirection.Ascending) {
      items.sort((first, second) => {
        if (first[col] < second[col]) {
          return -1;
        }
        if (first[col] > second[col]) {
          return 1;
        }

        return 0;
      });
    } else if (headerColSortSettingsRow[col] == SortDirection.Ascending) {
      items.sort((first, second) => {
        if (first[col] < second[col]) {
          return 1;
        }
        if (first[col] > second[col]) {
          return -1;
        }

        return 0;
      });
    }
  };
  function onDataGet(all) {
    if (isLoading) isLoading = false;
    const [h, d] = all;
    if (h === false) {
      authorized = false;
      er = d;
    }
    if (h.length) {
      fillHeadersArray(h);
    }
    if (d.r) {
      // reset quickViewKeys with empty array:
      // [...Array(20)].map(_=>0)
      // quickViewKeys = Array.from({length: d.length}, ()=>0);

      items = d.r.result ?? [];
      count = d.r.fullCount;
      current_page = d.r.pagination[2]; // change page if not same.
      calc_pagination();
      // selectAll_(false)
      selectedRowsKeys = dropNotExisting(
        selectedRowsKeys,
        items.map(x => getValue(x[0]))
      );

      setQueryParams();
    } else if (d.n) {
      items.push(...d.n.result);
      count = count + 1;
      doLocalSorting();
      items = items;
    } else if (d.m) {
      updateModifiedRow(d.m.result);
      items = items;
    } else if (d.d) {
      doLocalSorting();
      deleteRows_(d.d.result);
    }
  }
  function setQueryParams() {
    if (syncQueryParams) {
      const q =
        '?limit=' +
        limit +
        '&page=' +
        current_page +
        '&sort=' +
        (all(x => x === SortDirection.None || x === null, headerColSortSettingsRow)
          ? JSON.stringify([])
          : JSON.stringify(headerColSortSettingsRow)) +
        '&filter=' +
        JSON.stringify(filterSettings);
      const pathAndSearch = window.location.pathname + q;
      if (pathAndSearch !== window.location.pathname + window.location.search && q + q !== window.location.search) {
        console.log(window.location.pathname, window.location.search, 'replaced url query', pathAndSearch);
        history.replaceState({ page: pathAndSearch }, '', pathAndSearch);
      }
    }
  }
  /*=====  End of On Headers and Data Receive  ======*/

  /*====================================
  =            Add Edit Row            =
  ====================================*/
  let doms = { addbutton: null };
  let addnewform = false;
  let quickViewKeys = [];
  const toogleAddForm = () => {
    if (addnew_type == 'button') {
      addnewform = !addnewform;
      if (doms.addbutton) {
        doms.addbutton.focus();
      } else {
        er = 'no dom for add button!';
      }
    }
  };
  const closeForm_ = key => {
    const idx = quickViewKeys.findIndex(x => x == key);
    if (idx !== -1) {
      quickViewKeys.splice(idx, 1);
      quickViewKeys = quickViewKeys;
    }
  };
  const closeForms_ = keys => {
    let isFind = false;
    keys.forEach(key => {
      const idx = quickViewKeys.findIndex(x => x == key);
      if (idx !== -1) {
        isFind = true;
        quickViewKeys.splice(idx, 1);
      }
    });
    if (isFind) {
      quickViewKeys = quickViewKeys;
    }
  };
  const editButtonFocus = async key => {
    await tick();
    const element: HTMLElement | null = document.querySelector(`button[key='${key}'][name='edit']`);
    if (element) {
      element.focus();
    }
  };
  const successSave = e => {
    if (e.detail.key === null) {
      toogleAddForm();
    } else {
      closeForm_(e.detail.key);
      editButtonFocus(e.detail.key);
    }
  };
  const onCancel = event => {
    const key = event.detail;
    closeForm_(key);
    editButtonFocus(key);
  };
  /*=====  End of Add Edit Row  ======*/

  /*==================================
  =            Delete Row            =
  ==================================*/
  let rowEditDoms = [];
  const deleteRows_ = keys => {
    keys.forEach(k => {
      const index = selectedRowsKeys.findIndex(x => k === x);
      if (index > -1) {
        selectedRowsKeys.splice(index, 1);
      }
    });
    selectedRowsKeys = selectedRowsKeys;
    closeForms_(keys);
    keys.forEach(k => {
      const findIndex = items.findIndex(i => i[0] == k);
      if (findIndex !== -1) {
        // start, ?deleteCount, ...items
        items.splice(findIndex, 1);
      }
    });
    items = items;
  };
  const deleteRow = e => {
    const { key } = e.detail;
    deleteRows_([key]);
  };
  const { addNotification } = getNotificationsContext();
  const onDeleteRow = key => async () => {
    const r = confirm('Are You Sure?');
    if (r == true) {
      const mutate_evt = [ET.delete_, events[1], key];
      const filter = [`="${key}"`];
      const d = await new Promise((resolve, reject) => {
        /*send unsubscribe event if edit is open*/
        const args = ['DEL', filter, fetchConfig];
        if (rowEditDoms[key]) {
          const unsu_event = rowEditDoms[key]?.f?.unsub_evt ?? null;
          if (unsu_event) {
            args.push(unsu_event);
          }
        }
        Ws.bindT(
          mutate_evt,
          d => {
            resolve(d);
          },
          args
        );
      });
      if (d[0]) {
        const delete_msg = view(lensPath(['msg', 'delete']), $translation);
        addNotification({
          text: delete_msg,
          position: 'bottom-right',
          type: 'danger',
          removeAfter: 4000
        });
        deleteRows_([key]);
      } else {
        alert(d[1]);
      }
    }
  };
  const onDeleteSelected = async () => {
    const r = confirm('Are You Sure to delete selected rows?');
    if (r == true) {
      const mutate_evt = [selectedRowsKeys.length > 1 ? ET.batchDelete : ET.delete_, events[1], Ws.uid];
      const filter = [JSON.stringify(selectedRowsKeys)];
      const d = await new Promise((resolve, reject) => {
        Ws.bindT(
          mutate_evt,
          d => {
            resolve(d);
          },
          ['DEL', filter]
        );
      });
      d[0] ? deleteRows_(clone(selectedRowsKeys)) : alert(d[1]);
    }
  };
  /*=====  End of Delete Row  ======*/

  /*===============================
  =            Sorting            =
  ===============================*/
  const onHandleSort = (e, col, order) => {
    if (e.ctrlKey) {
    } else {
      if (order !== undefined) {
        headerColSortSettingsRow = new Array(headerColTypesRow).fill(SortDirection.None); // []
        headerColSortSettingsRow[col] = order;
        closeHeaderMenu();
      } else {
        const sortOrder = headerColSortSettingsRow[col];
        headerColSortSettingsRow = [];
        if (sortOrder === null || sortOrder === undefined || sortOrder === SortDirection.None) {
          headerColSortSettingsRow[col] = SortDirection.Ascending;
        } else if (sortOrder === SortDirection.Ascending) {
          headerColSortSettingsRow[col] = SortDirection.Descending;
        } else {
          headerColSortSettingsRow[col] = SortDirection.None;
        }
      }
    }
    refresh();
    // if (col.sortable === true && typeof col.value === "function") {
    //   if (sortKey === col.key) {
    //     sortOrder = sortOrder === 1 ? -1 : 1;
    //   } else {
    //     sortOrder = 1;
    //     sortKey = col.key;
    //     sortBy = r => col.value(r);
    //   }
    // }
  };
  /*=====  End of Sorting  ======*/

  /*======================================================
  =            Pass event to Parent. DISABLED            =
  ======================================================*/

  const dp = createEventDispatcher();
  function onItemClick(litem) {
    dp('onItemClick', { item: litem });
  }
  function onDeleteClick(litem) {
    dp('onDeleteClick', { item: litem });
  }

  /*=====  End of Pass event to Parent. DISABLED  ======*/

  /*====================================
    =            context-menu            =
    ====================================*/
  let headerMenuDisplayed = false;
  let inputheaderMenuDisplayed = false;
  let headerMenuColumn = 0;
  let inputHeaderMenuColumn = 0;
  const onHeaderContext = (e, col) => {
    const left = event.clientX;
    const top = event.clientY;
    const menuBox: HTMLElement | null = window.document.querySelector('.menu');
    if (menuBox) {
      menuBox.style.left = left + 'px';
      menuBox.style.top = top + 'px';
      menuBox.style.display = 'block';
      headerMenuDisplayed = true;
      headerMenuColumn = col;
    }
    // window.addEventListener("click", function() {
    //     if(headerMenuDisplayed == true){
    //         menuBox.style.display = "none";
    //     }
  };
  const onTextInputContext = (e, col) => {
    const left = event.clientX;
    const top = event.clientY;
    const menuBox: HTMLElement | null = window.document.querySelector('.menu-input');
    if (menuBox) {
      menuBox.style.left = left + 'px';
      menuBox.style.top = top + 'px';
      menuBox.style.display = 'block';
      inputheaderMenuDisplayed = true;
      inputHeaderMenuColumn = col;
    }
    // window.addEventListener("click", function() {
    //     if(headerMenuDisplayed == true){
    //         menuBox.style.display = "none";
    //     }
  };
  const closeHeaderMenu = () => {
    const menuBox: HTMLElement | null = window.document.querySelector('.menu');
    if (headerMenuDisplayed == true) {
      menuBox.style.display = 'none';
    }
  };
  const closeInputMenu = () => {
    const menuBox: HTMLElement | null = window.document.querySelector('.menu-input');
    if (inputheaderMenuDisplayed == true) {
      menuBox.style.display = 'none';
    }
  };
  /*=====  End of context-menu  ======*/

  /*=======================================
  =            multiple select            =
  =======================================*/

  let allSelected;
  let multipleSelected;
  $: allSelected = selectedRowsKeys.length == items.length ? true : false;
  $: multipleSelected = selectedRowsKeys.length ? true : false;

  const onSelectRowClick = e => {
    const index = selectedRowsKeys.findIndex(x => e.target.value == x);
    index > -1 ? selectedRowsKeys.splice(index, 1) : selectedRowsKeys.push(e.target.value);
    selectedRowsKeys = selectedRowsKeys;
    //e.preventDefault();
    //e.stopPropagation();
  };
  const selectAll_ = (v: boolean) => (selectedRowsKeys = v ? items.map(x => x[0]) : (selectedRowsKeys = []));
  const onSelectAllClick = e => {
    selectAll_(e.target.checked);
  };

  /*=====  End of multiple select  ======*/

  /*==============================
  =            config            =
  ==============================*/

  let config = false;
  const onConfigClicked = async () => {
    config = !config;
  };
  const onConfigApply = e => {
    fetchConfig['columns'] = e.detail.list;
    config = false;
    // const e1 = [header_evt, fetchConfig] // fix this(config)
    // Ws.trigger([e1]) // fix this
    //resetFilter_(); onHeaderGet() will do this.
    headerColSortSettingsRow = [];
    // refresh();
  };

  /*=====  End of config  ======*/

  /*=======================================
  =            model functions            =
  =======================================*/

  let modalIsVisible = false;
  let modelItem = [];
  // function onItemClick(litem) {
  //   item = litem;
  //   openModal();
  // }
  function closeModal() {
    modalIsVisible = false;
  }
  function openModal() {
    modalIsVisible = true;
  }
  function onNewClick() {
    modelItem = [];
    openModal();
  }

  /*=====  End of model functions  ======*/

  function isGlobal(v) {
    return isArray(v) ? (v.length >= 2 ? v[1] === 'global' : false) : false;
  }

  let showButton = false;
  let showComponent = false;
  $: {
    showButton = false;
    showComponent = false;
    if (addnew_type == 'button') {
      showButton = true;
      if (addnewform) {
        showComponent = true;
      }
    } else {
      showComponent = true;
    }
  }

  let showRowNum = true;
  function onShowRowNum() {
    showRowNum = !showRowNum;
  }
  $: colCount = headerColIsvisibleRow.filter(x => !!x).length;
  $: showResetFilterButton = filterSettings.filter(x => !!x).length > 0;
  $: operationsCount = 2;
  // can pass null to display nothing.
  function getValue(v) {
    return isArray(v) ? v[0] || '' : v;
  }
  let contextmenu = true;

  function makeUrl(props, id) {
    if (id) {
      return new UrlPattern(props.dp).stringify({
        id,
        org: org_id,
        project: project_id
      });
    } else {
      return '';
    }
  }

  const org_id_ctx = getContext('org_id');
  const org_id = org_id_ctx ? get(org_id_ctx) : '';
  const project_id_ctx = getContext('project_id');
  const project_id = project_id_ctx ? get(project_id_ctx) : '';

  css_count.increase('table_context_menu');
  onDestroy(() => {
    css_count.decrease('table_context_menu');
  });
  let css_loaded = false;
  $: {
    if (!css_loaded) {
      if (!$css_loading) {
        css_loaded = true;
      }
    }
  }
  const onEditSvgKeyPress = key => e => {
    if (e.keyCode == 13 || e.which == 13) {
      quickViewKeys.push(key);
      quickViewKeys = quickViewKeys;
    }
  };
  const onEditSvgClick = key => () => {
    quickViewKeys.push(key);
    quickViewKeys = quickViewKeys;
  };
  const onDeleteSvgKeyPress = key => e => {
    if (e.keyCode == 13 || e.which == 13) {
      onDeleteRow(key)();
    }
  };
  const toggleexpandedRowsKeys = key => {
    const idx = expandedRowsKeys.findIndex(x => x === key);
    if (idx > -1) {
      expandedRowsKeys.splice(idx);
    } else {
      expandedRowsKeys.push(key);
    }
    expandedRowsKeys = expandedRowsKeys;
  };
  const unMountCss = () => {
    css_count.decreaseNow('table');
  };

  /*=================================
  =            Draggable            =
  =================================*/

  /*=====  End of Draggable  ======*/
  enum dropPosition {
    none = 0,
    top,
    center,
    bottom
  }
  export let isdraggable = true; // Boolean

  export let fixed; // String | Boolean
  export let height; // String | Number
  export let border = true; // String
  export let onlySameLevelCanDrag; // String
  export let hightRowChange; // String
  export let resize = true; // String
  export let depth = 0;
  //export let beforeDragOver // Function
  //export let onDrag // Function

  let dragX = 0;
  let dragY = 0;
  let dragId = '';
  let targetId = '';
  let targetRevId = '';
  let whereInsert = dropPosition.none;
  let isDragging = false;
  let mouse = {
    status: 0,
    startX: 0,
    curColWidth: 0,
    curIndex: 0
  };
  let table = null;

  $: bodyStyle = `overflow: ${fixed !== undefined && fixed !== false ? 'auto' : 'hidden'}; height: ${
    fixed !== undefined && fixed !== false ? (height || 400) + 'px' : 'auto'
  };`;

  let dragData = {};
  function setDragData(d) {
    dragData = d;
  }

  /* drag main function 1 */
  function onDraggingOver(e) {
    //console.log('over', e)
    const isSourceData = e.dataTransfer.types.includes('source');
    if (!isSourceData) {
      console.log('drag and drop operaion from outside table.');
      return;
    }
    if (isEmpty(dragData)) {
      console.log('drag over operaion from outside table: empty dragData');
    }
    isDragging = true;
    if (e.pageX == dragX && e.pageY == dragY) return;
    dragX = e.pageX;
    dragY = e.clientY;
    targetId = undefined;
    targetRevId = undefined;
    filter(e.pageX, e.clientY, dragData);

    if (e.clientY < 100) {
      window.scrollTo(0, scrollY - 6);
    } else if (e.clientY > document.body.clientHeight - 160) {
      window.scrollTo(0, scrollY + 6);
    }
  }

  /* drag main function 2 */
  /* dragend */
  async function drop(e) {
    console.log('drop', e.target);
    // not work:
    // const isSourceData = e.dataTransfer.types.includes('source')
    // if (!isSourceData) {
    //   console.log('drag and drop operaion from outside table.')
    //   return
    // }
    if (isEmpty(dragData)) {
      console.log('drop operaion from outside table: empty dragData');
    }

    // fix it should return in some time limit.
    console.log(fetchConfig);
    const d = await new Promise((resolve, reject) => {
      Ws.bindT(
        drag_evt,
        d => {
          resolve(d);
        },
        [[dragData.dragId, dragData.dragRevId, targetId, targetRevId, whereInsert]]
      );
    });
    if (!d[0]) {
      clearHoverStatus();
      isDragging = false;
      return;
    }

    clearHoverStatus();

    resetTreeData(dragData); /* Main Function */
    isDragging = false;

    if (targetId !== undefined) {
      if (hightRowChange !== undefined) {
        await tick();
        const rowEle = document.querySelector("[tree-id='" + dragData.dragId + "']");
        rowEle.style.backgroundColor = 'rgba(64,158,255,0.5)';
        setTimeout(() => {
          rowEle.style.backgroundColor = 'rgba(64,158,255,0)';
        }, 2000);
      }
    }
    dragData = {};
  }
  let row;
  /* todo: fix only one line, this function is unsed while draggging over items.*/
  /**
   * 1. get all tree row
   * 2. this just show hover position
   *
   */

  // Find matching lines, handle drag and drop styles
  function filter(x, y, sourceData) {
    let rows = document.querySelectorAll('.tree-row');
    targetId = undefined;
    targetRevId = undefined;
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    const dragRect = sourceData.dragParentNode.getBoundingClientRect();
    const dragW = dragRect.left + sourceData.dragParentNode.clientWidth;
    const dragH = dragRect.top + sourceData.dragParentNode.clientHeight;

    if (x >= dragRect.left && x <= dragW && y >= dragRect.top && y <= dragH) {
      // The original block currently being dragged is not allowed to be inserted
      // console.log('same element !');
      return;
    }

    let hoverBlock = undefined;
    let targetIdTemp = undefined;
    let targetIdRevTemp = undefined;
    whereInsert = dropPosition.none;

    let row;
    for (let i = 0; i < rows.length; i++) {
      row = rows[i];
      const rect = row.getBoundingClientRect();
      const rx = rect.left;
      const ry = rect.top;
      const rw = row.clientWidth;
      const rh = row.clientHeight;

      if (x > rx && x < rx + rw && y > ry && y < ry + rh) {
        const diffY = y - ry;
        const pId = row.getAttribute('tree-p-id'); // It is not allowed to change the hierarchical structure, only the upper and lower order logic

        if (onlySameLevelCanDrag !== undefined && pId !== sourceData.dragPId) {
          return;
        }

        targetIdTemp = row.getAttribute('tree-id');
        targetIdRevTemp = row.getAttribute('tree-rev-id');
        hoverBlock = row.children[row.children.length - 1];
        let rowHeight = row.offsetHeight;

        if (diffY / rowHeight > 3 / 4) {
          whereInsert = dropPosition.bottom;
        } else if (diffY / rowHeight > 1 / 4) {
          if (onlySameLevelCanDrag !== undefined) {
            // It is not allowed to change the hierarchical structure, only the upper and lower order logic
            return;
          }

          whereInsert = dropPosition.center;
        } else {
          whereInsert = dropPosition.top;
        }

        break;
      }
    }

    if (targetIdTemp === undefined) {
      // Can't match to clear the previous state
      clearHoverStatus();
      whereInsert = dropPosition.none;
      return;
    }

    let canDrag = true;

    // Todo can disable some row drag and drop. set canDrag == false.
    /*if (beforeDragOver) { //todo fix this
      const curRow = getItemById(items, sourceData.dragId)
      const targetRow = getItemById(items, targetIdTemp)
      canDrag = beforeDragOver(curRow, targetRow, whereInsert)
    }*/

    if (canDrag == false) return;
    hoverBlock.style.display = 'block';
    let rowHeight = row.offsetHeight;

    if (whereInsert == dropPosition.bottom) {
      if (hoverBlock.children[2].style.opacity !== '0.5') {
        clearHoverStatus();
        hoverBlock.children[2].style.opacity = 0.5;
      }
    } else if (whereInsert == dropPosition.center) {
      if (hoverBlock.children[1].style.opacity !== '0.5') {
        clearHoverStatus();
        hoverBlock.children[1].style.opacity = 0.5;
      }
    } else {
      if (hoverBlock.children[0].style.opacity !== '0.5') {
        clearHoverStatus();
        hoverBlock.children[0].style.opacity = 0.5;
      }
    }

    targetId = targetIdTemp;
    targetRevId = targetIdRevTemp;
    whereInsert = whereInsert;
  }

  function resetTreeData(sourceData) {
    if (targetId === undefined) return;

    const newList = [];
    const curList = items;

    let curDragItem = null;
    let targetItem = null;

    let isExapndedModified = false;

    function pushData(curList, needPushList) {
      for (let i = 0; i < curList.length; i++) {
        const item = curList[i];
        let obj = clone(item);
        const key = getValue(item[0]);
        obj[0] = [key, []]; //obj[0][1] = [] // empty_logic

        if (targetId == key) {
          curDragItem = getItemById(items, sourceData.dragId);
          targetItem = getItemById(items, targetId);

          if (whereInsert === dropPosition.top) {
            //curDragItem['parent_id'] = item['parent_id']
            needPushList.push(curDragItem);
            needPushList.push(obj);
          } else if (whereInsert === dropPosition.center) {
            // Dont expand automatically:
            // if (!expandedRowsKeys.includes(key)) {
            //   expandedRowsKeys.push(key);
            // }
            // isExapndedModified = true;
            
            // Now not need this:
            // if (isArray(obj[0])) {
            //   obj[0][1].push(curDragItem);
            // } else {
            //   obj[0] = [key, [curDragItem]];
            // }
            needPushList.push(obj);
          } else if (whereInsert === dropPosition.bottom) {
            //curDragItem['parent_id'] = item['parent_id']
            needPushList.push(obj);
            needPushList.push(curDragItem);
          } else {
            console.log('whereInsert must be valid: ', whereInsert);
            needPushList.push(curDragItem);
            needPushList.push(obj);
          }
        } else {
          if (sourceData.dragId != key) {
            needPushList.push(obj); // empty_logic
          }
        }

        // empty_logic
        if (isArray(item[0]) && item[0][1] && item[0][1].length) {
          pushData(item[0][1], obj[0][1]);
        }
      }
    }

    pushData(curList, newList);
    items = newList;
    if (isExapndedModified) expandedRowsKeys = expandedRowsKeys;
    /////resetOrder(newList)
    ////onDrag(newList, curDragItem, targetItem, _this.whereInsert)
  }

  // Reset all data order
  /* todo : fix this function */
  /*function resetOrder(list) {
    for (let i = 0; i < list.length; i++) {
      list[i]['order'] = i

      if (list[i]['lists'] && list[i]['lists'].length) {
        resetOrder(list[i]['lists'])
      }
    }
  }*/

  // Get current row based on id
  function getItemById(lists, id) {
    let curItem = null;

    function getchild(curList) {
      for (let i = 0; i < curList.length; i++) {
        let item = curList[i];

        if (getValue(item[0]) == id) {
          curItem = clone(item);
          break;
        } else if (isArray(item[0]) && item[0][1] && item[0][1].length) {
          getchild(item[0][1]);
        }
      }
    }

    getchild(lists);
    return curItem;
  }

  // Get current row based on id
  function DelById(id) {
    const newList = [];
    const curList = items;

    function pushData(curList, needPushList) {
      //let order = 0

      for (let i = 0; i < curList.length; i++) {
        const item = curList[i];

        if (getValue(item[0]) != id) {
          let obj = clone(item);
          //obj['order'] = order
          obj[0] = [getValue(item[0]), []]; //obj[0][1] = []
          needPushList.push(obj);
          order++;

          if (isArray(item[0]) && item[0][1] && item[0][1].length) {
            pushData(item[0][1], obj[0][1]);
          }
        }
      }
    }

    pushData(curList, newList);
    return newList;
  }

  // Set properties recursively, only allowed to set component built-in properties
  function deepSetAttr(key, val, list, ids = undefined) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const changeAttribute = (k, v) => {
        if (key == 'open') {
          const idx = expandedRowsKeys.findIndex(x => x === k);
          if (v) {
            if (idx === -1) {
              expandedRowsKeys.push(k);
            }
          } else {
            if (idx > -1) {
              expandedRowsKeys.splice(idx, 1);
            }
          }
        } else if (key == 'highlight') {
          // todo fix this
        }
      };

      if (ids !== undefined) {
        if (ids.includes(getValue(item[0]))) {
          changeAttribute(getValue(item[0]), val);
        }
      } else {
        changeAttribute(getValue(item[0]), val);
      }

      if (isArray(item[0]) && item[0][1] && item[0][1].length) {
        deepSetAttr(key, val, item[0][1], ids);
      }
    }
    if (key == 'open') {
      expandedRowsKeys = expandedRowsKeys;
    } else if (key == 'highlight') {
      // todo fix this
    }
  }

  function ZipAll(id, deep = true) {
    deepSetAttr('open', false, items);
  }

  function OpenAll(id, deep = true) {
    deepSetAttr('open', true, items);
  }

  function GetLevelById(id) {
    row = table.querySelector('[tree-id="' + id + '"]');
    let level = row.getAttribute('data-level') * 1;
    return level;
  }

  function HighlightRow(id, isHighlight = true, deep = false) {
    let list = clone(items);
    let ids = [id];

    if (deep == true) {
      ids = ids.concat(GetChildIds(id, true));
    }

    deepSetAttr('highlight', isHighlight, list, ids);
    items = list;
  }

  function AddRow(pId, data) {
    // todo: note: data is json obj
    const deepList = clone(items);

    function deep(list) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (getValue(item[0]) == pId) {
          item['open'] = true;
          let newRow = Object.assign({}, data);
          ////newRow['parent_id'] = pId

          if (isArray(item[0]) && item[0][1] && item[0][1].length) {
            ////newRow['order'] = item['lists'].length
            item[0][1].push(newRow);
          } else {
            item[0][1] = [];
            ////newRow['order'] = 0
            item[0][1].push(newRow);
          }
        }

        if (isArray(item[0]) && item[0][1] && item[0][1].length) {
          deep(item[0][1]);
        }
      }
    }

    deep(deepList);
    items = deepList;
  }

  function EditRow(id, data) {
    const deepList = clone(items);

    function deep(list) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (getValue(item[0]) == id) {
          let newRow = Object.assign({}, item, data);
          //console.log(2222, newRow)
          item = newRow;
        }

        if (isArray(item[0]) && item[0][1] && item[0][1].length) {
          deep(item[0][1]);
        }
      }
    }

    deep(deepList);
    //console.log(deepList)
    items = deepList;
  }

  function GetChildIds(id, deep = true) {
    let ids = [];

    function getChilds(list, id, addAll = false) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        let currentPid = '';
        let pid = getValue(item[0]); // list[i]['parent_id']

        if (addAll || id == pid) {
          currentPid = getValue(item[0]);
          ids.push(currentPid);
        } else {
          currentPid = id;
        }

        if (deep == true || id == currentPid) {
          if (isArray(item[0]) && item[0][1] && item[0][1].length) {
            getChilds(item[0][1], currentPid, true);
          }
        }
      }
    }

    getChilds(items, id);
    return ids;
  }

  // Select button event
  function onCheckAll(evt, func) {
    setAllCheckData(items, !!evt.target.checked);
    const checkedList = getCheckedList(items);
    func && func(checkedList);
  }

  // Batch process data according to flag
  function setAllCheckData(curList, flag) {
    for (let i = 0; i < curList.length; i++) {
      let item = curList[i];
      // this.$set(item, 'checked', flag); // todo fix this

      if (isArray(item[0]) && item[0][1] && item[0][1].length) {
        setAllCheckData(item[0][1], flag);
      }
    }
  }

  // Get all selected rows
  function getCheckedList(lists) {
    let checkedList = [];
    const deepList = clone(lists);

    function getchild(curList) {
      for (let i = 0; i < curList.length; i++) {
        let item = curList[i];

        if (item.checked && item.isShowCheckbox != false) {
          checkedList.push(item);
        }

        if (isArray(item[0]) && item[0][1] && item[0][1].length) {
          getchild(item[0][1]);
        }
      }
    }

    getchild(deepList);
    return checkedList;
  }

  function mousedown(curIndex, e) {
    const startX = e.target.getBoundingClientRect().x;
    const curColWidth = e.target.parentElement.offsetWidth;
    mouse = {
      status: 1,
      startX,
      curIndex,
      curColWidth
    };
  }
  const mouseup = e => {
    if (mouse.status) {
      const curX = e.clientX;
      let line = document.querySelector('.drag-line');
      line.style.left = '-10000px';
      mouse.status = 0;
      const curWidth = mouse.curColWidth;
      const subWidth = curX - mouse.startX;
      const lastWidth = curWidth + subWidth;
      const cols = document.querySelectorAll('.colIndex' + mouse.curIndex);

      for (let index = 0; index < cols.length; index++) {
        const element = cols[index];
        element.style.width = lastWidth + 'px';
      } // Update data source

      ////data.columns[mouse.curIndex].width = lastWidth /* todo: fix this line*/
    }
  };
  const mousemove = e => {
    if (mouse.status) {
      const endX = e.clientX;
      const tableLeft = document.querySelector('.drag-tree-table').getBoundingClientRect().left;
      let line = document.querySelector('.drag-line');
      line.style.left = endX - tableLeft + 'px';
    }
  };

  function clearHoverStatus() {
    const rows: NodeListOf<HTMLElement> = document.querySelectorAll('.tree-row');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const hoverBlock = row.children[row.children.length - 1] as HTMLElement;
      hoverBlock.style.display = 'none';
      hoverBlock.children[0].style.opacity = 0.1;
      hoverBlock.children[1].style.opacity = 0.1;
      hoverBlock.children[2].style.opacity = 0.1;
    }
  }
  function getElementTop(element, tableRef) {
    // Fixed header, need special calculation
    let scrollTop = tableRef.querySelector('.drag-tree-table-body').scrollTop;
    let actualTop = element.offsetTop - scrollTop;
    let current = element.offsetParent;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    return actualTop;
  }
  function getElementLeft(element) {
    let actualLeft = element.offsetLeft;
    let current = element.offsetParent;
    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return actualLeft;
  }

  onMount(() => {
    // window.addEventListener('mouseup', mouseup);
    // window.addEventListener('mousemove', mousemove);
  });
  onDestroy(() => {
    // window.removeEventListener('mouseup', mouseup);
    // window.removeEventListener('mousemove', mousemove);
  });
</script>

{#if css_loaded}
  <div class="table_wrap" style={`margin-left: ${depth*10}px`}>
    {#if !$is_production}
      <button on:click={unMountCss}>Unmount css</button>
    {/if}
    {#if addnew_pos == 't'}
      {#if showButton}
        <button name="table_add" class={addnewform ? 'pressed' : ''} bind:this={doms.addbutton} on:click={toogleAddForm}>
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
      <input class="w60" type="number" bind:value={limit} on:change={onLimitChange} min="0" title="press Enter/Tab" />
      {#if false}
        <button class="" on:click={refresh}>Refresh</button>
      {/if}
      <button class="" on:click={ZipAll}>Collepse All</button>
      <button class="" on:click={OpenAll}>Expand All</button>
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
      {#if !$is_production}
        <button type="button" on:click={onConfigClicked}>Config</button>
      {/if}
      {#if config}
        <Config {schema_key} on:close={() => (config = !config)} on:configApply={onConfigApply} />
      {/if}
    {/if}
    {#if headerColTitlesRow.length}
      {#if authorized}
        <div class="drag-tree-table" bind:this={table} class:border>
          {#if showHeader}
            <div class="drag-tree-table-header" on:mousemove={mousemove}  >

              <Column width={25} flex={false} {border} class={['align-' + 'center', 'colIndex' + 0]}>
                <input type="checkbox" bind:checked={allSelected} on:click={onSelectAllClick} />
                {#if true}
                  <div class="resize-line" on:mousedown={event => mousedown(0, event)} />
                {/if}
              </Column>
              {#if showRowNum}
                <Column width={50} flex={false} {border} class={['align-' + 'center', 'colIndex' + 1]}>
                  <span>No</span>
                  {#if true}
                    <div class="resize-line" on:mousedown={event => mousedown(1, event)} />
                  {/if}
                </Column>
              {/if}
              {#each headerColTitlesRow as h, index}
                {#if headerColIsvisibleRow[index]}
                  <Column width={100} flex={false} {border} class={['align-' + 'center', 'colIndex' + (2 + index)]}>
                    <div on:click={e => onHandleSort(e, index)} on:contextmenu|preventDefault={e => onHeaderContext(e, index)}>
                      {h}
                      {#if headerColSortSettingsRow[index] === SortDirection.Ascending}
                        ▲
                      {:else if headerColSortSettingsRow[index] === SortDirection.Descending}
                        ▼
                      {:else}
                        <!-- content here -->
                      {/if}
                    </div>

                    <div class="resize-line" on:mousedown={event => mousedown(index + 2, event)} />
                  </Column>
                {/if}
              {/each}

              <Column
                width={operationsCount * 50}
                flex={false}
                {border}
                class={['align-' + 'center', 'colIndex' + (2 + headerColTitlesRow.length)]}>

                <span>Actions</span>
                <div class="resize-line" on:mousedown={event => mousedown(2 + headerColTitlesRow.length, event)} />
              </Column>

              <!-- <div width="100px">Actions</div> -->

            </div>
            <div class="drag-tree-table-header" >
              <Column width={25} flex={false} {border} class={['align-' + 'center', 'colIndex' + 0]}>

                <span />
                <div class="resize-line" on:mousedown={event => mousedown(0, event)} />
              </Column>
              {#if showRowNum}
                <Column width={50} flex={false} {border} class={['align-' + 'center', 'colIndex' + 1]}>

                  <span />
                  <div class="resize-line" on:mousedown={event => mousedown(1, event)} />
                </Column>
              {/if}
              {#each headerColTitlesRow as h, index}
                {#if headerColIsvisibleRow[index]}
                  {#if headerColCustomFilter[index]}
                    <Column width={100} flex={false} {border} class={['align-' + 'center', 'colIndex' + (2 + index)]}>

                      <select bind:value={filterSettings[index]} on:change={onHandleFilter(index)}>
                        {#each headerColCustomFilter[index] as f}
                          <option value={f[1]}>{f[0]}</option>
                        {/each}
                      </select>
                      <div class="resize-line" on:mousedown={event => mousedown(index + 2, event)} />
                    </Column>
                  {:else if headerColTypesRow[index] === DisplayType.Number || headerColTypesRow[index] === DisplayType.Text || headerColTypesRow[index] === DisplayType.Double || headerColTypesRow[index] === DisplayType.Url}
                    <Column width={100} flex={false} {border} class={['align-' + 'center', 'colIndex' + (2 + index)]}>

                      <input
                        type="search"
                        placeholder=" &#128269;"
                        bind:value={filterSettings[index]}
                        on:input={onHandleFilter(index)}
                        on:contextmenu|preventDefault={e => onTextInputContext(e, index)} />
                      <div class="resize-line" on:mousedown={event => mousedown(index + 2, event)} />
                    </Column>
                  {:else if headerColTypesRow[index] === DisplayType.Checkbox}
                    <Column width={100} flex={false} {border} class={['align-' + 'center', 'colIndex' + (2 + index)]}>

                      <input
                        type="checkbox"
                        bind:checked={filterSettings[index]}
                        on:change={onHandleFilter(index)}
                        on:contextmenu|preventDefault={e => onTextInputContext(e, index)} />
                      <div class="resize-line" on:mousedown={event => mousedown(index + 2, event)} />
                    </Column>
                  {:else if headerColTypesRow[index] === DisplayType.DateTime}
                    <Column width={100} flex={false} {border} class={['align-' + 'center', 'colIndex' + (2 + index)]}>

                      <span>Date</span>
                      <div class="resize-line" on:mousedown={event => mousedown(index + 2, event)} />
                    </Column>
                    <!-- {:else if headerColTypesRow[index] === DisplayType.Url}
                    <div /> -->
                  {:else if headerColTypesRow[index] === DisplayType.Color}
                    <Column width={100} flex={false} {border} class={['align-' + 'center', 'colIndex' + (2 + index)]}>

                      <span />
                      <div class="resize-line" on:mousedown={event => mousedown(index + 2, event)} />
                    </Column>
                  {:else}
                    <Column width={100} flex={false} {border} class={['align-' + 'center', 'colIndex' + (2 + index)]}>

                      <span>Unknown Type {headerColTypesRow[index]}</span>
                      <div class="resize-line" on:mousedown={event => mousedown(index + 2, event)} />
                    </Column>
                  {/if}
                {/if}
              {/each}

              <Column
                width={operationsCount * 50}
                flex={false}
                {border}
                class={['align-' + 'center', 'colIndex' + (2 + headerColTitlesRow.length)]}>

                <div>
                  <!-- <div width="100px"></th> -->
                </div>
                <div class="resize-line" on:mousedown={event => mousedown(2 + headerColTitlesRow.length, event)} />
              </Column>

            </div>
          {/if}

          <div
            class="drag-tree-table-body"
            style={bodyStyle}
            on:dragover|preventDefault={onDraggingOver}
            on:dragend|preventDefault|stopPropagation={drop}
            class:is-dragging={isDragging}>

            {#each items as r, rowIndex (getValue(r[0]))}
              <Row
                depth={depth}
                {isdraggable}
                {border}
                isGlobalRow={isGlobal}
                rowValue={r}
                {rowIndex}
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
                {setDragData} />
            {/each}

          </div>

          <div class="drag-line" on:mouseup={mouseup}/>
        </div>
      {/if}
      <Error {er} />
      {#if addnew_pos == 'b'}
        {#if showButton}
          <button name="table_add" class={addnewform ? 'pressed' : ''} bind:this={doms.addbutton} on:click={toogleAddForm}>
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
        <div class="table-context-menu">
          <div class="table-context-menu-item" on:click={e => onHandleSort(e, headerMenuColumn, 0)}>Sort Ascending</div>
          <div class="table-context-menu-item" on:click={e => onHandleSort(e, headerMenuColumn, 1)}>Sort Descending</div>
          <div class="table-context-menu-item" on:click={e => onHandleSort(e, headerMenuColumn, null)}>No Sorting</div>
          <hr />
          <div class="table-context-menu-item" on:click={closeHeaderMenu}>Close</div>
        </div>
        <div class="table-context-menu-input">
          <div class="table-context-menu-item">Is NULL</div>
          <div class="table-context-menu-item">Is not NULL</div>
          <div class="table-context-menu-item">Is empty</div>
          <div class="table-context-menu-item">Is not empty</div>
          <hr />
          <div class="table-context-menu-item">Equal to...</div>
          <div class="table-context-menu-item">Not equal to...</div>
          <div class="table-context-menu-item">Greater than...</div>
          <div class="table-context-menu-item">Less than...</div>
          <div class="table-context-menu-item">Greater or equal...</div>
          <div class="table-context-menu-item">Less or equal...</div>
          <div class="table-context-menu-item">In range...</div>
          <hr />
          <div class="table-context-menu-item" on:click={closeInputMenu}>Close</div>
        </div>
      {/if}
      {#if modalIsVisible}
        <Modal on:close={closeModal}>
          <header slot="header">
            <button class="" aria-label="close" on:click={closeModal}>X</button>
          </header>
          <svelte:component this={modelcomponent} on:close={closeModal} on:successSave={refresh} {headerColTitlesRow} {items} />
        </Modal>
      {/if}
    {/if}
    {#if isLoading}
      <Skeleton />
    {/if}
  </div>
{/if}
