<script lang="ts">
  export let value
  export let props = {}
  $: {
    const t = new Date(value)
    value = t.toLocaleString()
  }
</script>

<span {...props}>{value}</span>
