<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { css_count } from '../../css';
  // How TO - Scroll Back To Top Button
  // https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
  let button;
  css_count.increase('scrolltop');
  onMount(() => {
    // When the user scrolls down 20px from the top of the document, show the button
    // window.onscroll = function() { scrollFunction() }
  });
  onDestroy(() => {
    // window.onscroll = undefined
    css_count.decrease('scrolltop');
  });
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
  let y;
  $: {
    if (button) {
      button.style.display = y > 20 ? 'block' : 'none';
    }
  }
  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
</script>

<svelte:window bind:scrollY={y} />
<button class={'scrolltop'} on:click={topFunction} bind:this={button} title="Go to top">Top</button>
