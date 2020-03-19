<script lang="ts">
  import { tick } from 'svelte'
  import Title from './UI/Title.svelte'
  import GeneralForm from './form/Index.svelte'
  export let currentRoute: {
    params?: { default_pattern?: string }
    namedParams?: {}
  } = {}
  //export let default_pattern = [[0, "user"], [1, ''], [2, '']]
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
  class A {
    isFirst = true
  }
  const a = new A()
  async function remount1() {
    show = false
    await tick()
    show = true
  }
  $: {
    currentRoute
    if (!a.isFirst) {
      remount1()
    } else {
      a.isFirst = false
    }
  }
</script>

<Title {currentRoute} />
{#if show}
  <div>
    <GeneralForm {...currentRoute.params} form={default_value} />
  </div>
{/if}
