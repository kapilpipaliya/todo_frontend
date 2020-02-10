<script lang='ts'>
  import { onMount, onDestroy, tick } from '../../../modules/index'
  import { css_count } from '../../../modules/global_stores/css'
  declare let $css_count
 	export let value = {}
  export let disabled = false
  
  let jsonediDom = null
  let jsoneditor
  declare let JSONEditor

  onMount(async () => {
    $css_count.jsoneditor = ($css_count.jsoneditor || 0) + 1
    
    const options = {
      mode: disabled ? 'view' : 'code',
      modes: ["code", "tree"],
			onChange: function(){
        try {
          value = jsoneditor.get()
        } catch (err) {
          console.warn('Error in onChange callback: ', err)
        }
      }
    }; 
    /*const {default: JSONEditor} = */ await import( "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/7.0.5/jsoneditor.min.js" );
    await tick();
    jsoneditor = new JSONEditor(jsonediDom, options, value)
  })
  onDestroy(() => {
    $css_count.jsoneditor = $css_count.jsoneditor - 1
  })

</script>


<div>
	<div name='form' bind:this={jsonediDom} style="width: 1200px; height: 400px;" />
</div>
