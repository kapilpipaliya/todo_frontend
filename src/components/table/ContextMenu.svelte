<script lang='ts'>
  import { onMount, onDestroy } from '../../modules/index'
  import Modal from './Model.svelte'
  import { css_count } from '../../modules/global_stores/css'

  export let closeHeaderMenu
  export let contextmenu
  export let modalIsVisible
  export let closeModal
  export let modelcomponent
  export let refresh
  export let headerTitlesRow
  export let items
  export let closeInputMenu
  export let onHandleSort
  export let headerMenuColumn
  export let inputHeaderMenuColumn

  css_count.increase('table_context_menu')
  onDestroy(() => {
      css_count.decrease('table_context_menu')
  })
</script>
{#if contextmenu}
  <div class="menu">
    <div class="menu-item" on:click={e => onHandleSort(e, headerMenuColumn, 0)}>Sort Ascending</div>
    <div class="menu-item" on:click={e => onHandleSort(e, headerMenuColumn, 1)}>Sort Descending</div>
    <div class="menu-item" on:click={e => onHandleSort(e, headerMenuColumn, null)}>No Sorting</div>
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

