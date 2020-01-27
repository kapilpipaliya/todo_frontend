<script lang='ts'>
  import Modal from './Model.svelte'
  export let contextmenu
  export let modalIsVisible
  export let closeModal
  export let modelcomponent
  export let refresh
  export let headerTitlesRow
  export let items
  export let closeInputMenu

</script>
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

