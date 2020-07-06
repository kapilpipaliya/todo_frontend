  import { SortDirection } from '../../enums';
  /*==============================
  =            filter            =
  ==============================*/
  /*=====  End of filter  ======*/

  /*==================================
  =            Pagination            =
  ==================================*/
  /*=====  End of Pagination  ======*/

  /*=====================================
  =            Re Fetch Data            =
  =====================================*/
  /*=====  End of Re Fetch Data  ======*/

  /*===================================================
  =            On Headers and Data Receive            =
  ===================================================*/
  export function dropNotExisting(a1: string[], b1: string[]) {
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
  export function doLocalSorting (items: [], sortSettings: SortDirection[]) {
    const col = sortSettings.findIndex(x => x == SortDirection.Ascending || x == SortDirection.Descending);
    if (col == -1) {
      return [false, items];
    }
    if (sortSettings[col] == SortDirection.Ascending) {
      items.sort((first, second) => {
        if (first[col] < second[col]) {
          return -1;
        }
        if (first[col] > second[col]) {
          return 1;
        }

        return 0;
      });
      return [true, items];
    } else if (sortSettings[col] == SortDirection.Ascending) {
      items.sort((first, second) => {
        if (first[col] < second[col]) {
          return 1;
        }
        if (first[col] > second[col]) {
          return -1;
        }

        return 0;
      });
      return [true, items];
    }
    return [false, items];
  };
  /*=====  End of On Headers and Data Receive  ======*/

  /*====================================
  =            Add Edit Row            =
  ====================================*/
  /*=====  End of Add Edit Row  ======*/

  /*==================================
  =            Delete Row            =
  ==================================*/
  /*=====  End of Delete Row  ======*/

  /*===============================
  =            Sorting            =
  ===============================*/
  /*=====  End of Sorting  ======*/

  /*======================================================
  =            Pass event to Parent. DISABLED            =
  ======================================================*/
  /*=====  End of Pass event to Parent. DISABLED  ======*/

  /*====================================
    =            context-menu            =
    ====================================*/
  /*=====  End of context-menu  ======*/

  /*=======================================
  =            multiple select            =
  =======================================*/
  /*=====  End of multiple select  ======*/

  /*==============================
  =            config            =
  ==============================*/
  /*=====  End of config  ======*/

  /*=======================================
  =            model functions            =
  =======================================*/
  /*=====  End of model functions  ======*/
  /*=================================
  =            Draggable            =
  =================================*/
  export function clearHoverStatus() {
    const rows = document.querySelectorAll<HTMLElement>('.tree-row');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const hoverBlock = row.children[row.children.length - 1] as HTMLElement;
      hoverBlock.style.display = 'none';
      (hoverBlock.children[0] as HTMLElement).style.opacity = "0.1";
      (hoverBlock.children[1] as HTMLElement).style.opacity = "0.1";
      (hoverBlock.children[2] as HTMLElement).style.opacity = "0.1";
    }
  }
  // not used elsewhere
  export function getElementTop(element, tableRef) {
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
  // not used elsewhere
  export function getElementLeft(element) {
    let actualLeft = element.offsetLeft;
    let current = element.offsetParent;
    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return actualLeft;
  }
  /*=====  End of Draggable  ======*/