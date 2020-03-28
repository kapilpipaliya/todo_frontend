<script lang="ts">
  /**
   * Form wrapper to re render Form when there is same router.
   * It is not possible to use same form component without re rendering.
   */

  import { tick } from 'svelte'
  import Title from './UI/Title.svelte'
  import GeneralForm from './form/Index.svelte'
  export let currentRoute: {
    params?: { default_pattern?: string }
    namedParams?: {}
  } = {}
  //[[0, "user"], [1, ''], [2, '']]
  let default_pattern
  $: default_pattern = currentRoute?.params?.default_pattern ?? []
  let default_value = []
  function fillDefaultValue() {
    default_value = []
    function addDefaultvalue(x) {
      const index = x[0]
      const key = x[1]
      default_value[index] = currentRoute?.namedParams?.[key] ?? ''
    }
    default_pattern.forEach(x => {
      addDefaultvalue(x)
    })
  }
  $: {
    currentRoute
    fillDefaultValue()
  }
  let show = true
  async function remount() {
    show = false
    await tick()
    show = true
  }
  let isFirst = true
  $: {
    currentRoute
    if (!isFirst) {
      remount()
    } else {
      isFirst = false
    }
  }
</script>

<Title {currentRoute} />
{#if show}
  <div>
    <GeneralForm {...currentRoute.params} form={default_value} />
  </div>
{/if}
