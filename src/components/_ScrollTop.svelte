<script>
  import { onMount, onDestroy, createEventDispatcher } from '../modules/functions.ts'
  // How TO - Scroll Back To Top Button
  // https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
  let button

  onMount(() => {
      // When the user scrolls down 20px from the top of the document, show the button
      window.onscroll = function() {
        scrollFunction()
      }
  })
  onDestroy(() => {
      window.onscroll = undefined
  })
  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      button.style.display = 'block'
    } else {
      button.style.display = 'none'
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }
</script>

<style>
  button {
    display: none;
    position: fixed;
    bottom: 20px;
    right: 30px;
    z-index: 99;

    border: none;
    outline: none;
    background-color: red;
    color: white;
    cursor: pointer;
    padding: 15px;
    border-radius: 4px;
  }

  button:hover {
    background-color: #555;
  }
</style>

<button on:click={topFunction} bind:this={button} title="Go to top">Top</button>
