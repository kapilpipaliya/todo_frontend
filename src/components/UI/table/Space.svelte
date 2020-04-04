<script>
  export let depth
  $: spaces = (() => {
    const aArr = []
    for (let i = 0; i < depth; i++) {
      aArr.push('')
    }
    return aArr
  })()
</script>

<span class="space-container">
  {#each spaces as item, index}
    <span class="space" key={index} />
  {/each}
</span>
