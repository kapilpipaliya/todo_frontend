<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { css_count } from '../../css';
  css_count.increase('la-ball-scale-ripple-multiple');
  onDestroy(() => {
    css_count.decrease('la-ball-scale-ripple-multiple');
  });
</script>

<div class="la-ball-scale-ripple-multiple la-3x">
  <div />
  <div />
  <div />
</div>
