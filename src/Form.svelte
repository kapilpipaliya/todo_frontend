<script lang='ts'>
  import {  event_type as et,events as e, Unique } from './modules/functions.ts'

  import GeneralForm from './components/form/Index.svelte'
  import Title from './components/Title.svelte'
  import * as R from 'ramda'

  export let currentRoute

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

<Title {currentRoute}/>

<div>
  <GeneralForm {...currentRoute.params} form={default_value} />
</div>

<p>
  By creating an account you agree to our
  <a href="page/privacy">Terms & Privacy</a>
  .
</p>

<div class="signin">
  <p>
    Already have an account?
    <a href="account/login">Sign in</a>
    .
  </p>
  <p>An account is needed to purchase a product</p>
</div>
