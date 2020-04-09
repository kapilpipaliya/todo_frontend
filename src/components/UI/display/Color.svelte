<script lang="ts">
  export let value;
  export let props = {};
</script>

<div {...props} style={`background-color: ${value};`}>{`.`}</div>
