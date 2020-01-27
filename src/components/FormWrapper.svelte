<script lang='ts'>
  import { tick } from '../modules/index.ts'
  import Title from './Title.svelte'
  import GeneralForm from './form/Index.svelte'

  export let currentRoute = {}

  //export let default_pattern = [[0, "user"], [1, ''], [2, '']]
  $: default_pattern = currentRoute?.params?.default_pattern ?? []
  
  let default_value = []

  function fillDefaultValue() {
    default_value = []
    function addDefaultvalue(x){
      const index = x[0]
      const key = x[1]
      default_value[index] = currentRoute?.namedParams?.[key] ?? ''
    }
    default_pattern.forEach(x=>{
      addDefaultvalue(x)
    })
  }
  $: { fillDefaultValue(currentRoute) }


  let show = true
  class A {isFirst = true}
  const a = new A
  async function remount1(){
    show = false
    await tick()
    show = true
  }
  $: {
    if(!a.isFirst){ remount1(currentRoute)} else {a.isFirst = false}
  }

</script>

<Title {currentRoute} />

{#if show}
  <div>
    <GeneralForm {...currentRoute.params} form={default_value} />
  </div>
{/if}
