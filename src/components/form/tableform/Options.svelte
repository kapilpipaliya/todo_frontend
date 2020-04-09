<script lang="ts">
  import { onMount } from 'svelte';
  import { type } from 'rambdax';
  export let options = [];
  export let keyIdx = 0;
  export let dp = [1, ' - ', 2];

  // [1, ' - ',2], [...]
  function stringifyRawPattern(pattern: Array<number | string>, row: []) {
    let str = '';
    pattern.forEach(x => {
      if (type(x) == 'Number') {
        str += row[x as number];
      } else {
        str += x;
      }
    });
    return str;
  }

  function render(r) {
    return stringifyRawPattern(dp, r);
  }
</script>

{#each options as r (r[0])}
  <option value={r[keyIdx]}>{render(r)}</option>
{/each}
