<script lang='ts'>
  import { onMount, onDestroy, createEventDispatcher } from '../modules/index'
  import { css_count } from '../modules/global_stores/css'
  declare let $css_count
  // How TO - Scroll Back To Top Button
  // https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
  let button

  onMount(() => {
      // When the user scrolls down 20px from the top of the document, show the button
      // window.onscroll = function() { scrollFunction() }
      $css_count.scrolltop = ($css_count.scrolltop || 0) + 1
  })
  onDestroy(() => {
      // window.onscroll = undefined
      $css_count.scrolltop = $css_count.scrolltop - 1
  })
  /*function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      button.style.display = 'block'
    } else {
      button.style.display = 'none'
    }
  }*/
  let y
  $: {
    if(button){
      if(y > 20) {
        button.style.display = 'block'
      } else {
        button.style.display = 'none'
      }
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

</script>

<svelte:window bind:scrollY={y}/>
<button class={"scrolltop"} on:click={topFunction} bind:this={button} title="Go to top">Top</button>
