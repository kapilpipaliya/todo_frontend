<script lang='ts'>
  import Title from './Title.svelte'
  import GeneralForm from './form/Index.svelte'

  export let currentRoute = {}

  //export let default_pattern = [[0, "user"], [1, ''], [2, '']]
  let default_pattern = currentRoute?.params?.default_pattern ?? []
  
  let default_value = []

  function addDefaultvalue(x){
    const index = x[0]
    const key = x[1]
    default_value[index] = currentRoute?.namedParams?.[key] ?? ''
  }
  default_pattern.forEach(x=>{
    addDefaultvalue(x)
  })
</script>

<Title {currentRoute} />

<div>
  <GeneralForm {...currentRoute.params} form={default_value} />
</div>
