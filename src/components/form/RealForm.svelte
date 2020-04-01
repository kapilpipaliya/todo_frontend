<script lang="ts">
  import { FormType } from '../../enums'
  import Checkboxes from './input/Checkboxes.svelte'
  import Color from './input/Color.svelte'
  import Email from './input/Email.svelte'
  import File from './input/File.svelte'
  import Hidden from './input/Hidden.svelte'
  import Number from './input/Number.svelte'
  import Password from './input/Password.svelte'
  import Range from './input/Range.svelte'
  import Search from './input/Search.svelte'
  import Text from './input/Text.svelte'
  import Checkbox from './input/Checkbox.svelte'
  import Radio from './input/Radio.svelte'
  import Textarea from './input/Textarea.svelte'
  import JsonEditor from './input/JsonEditor.svelte'
  import Flatpicker from './input/Flatpicker.svelte'
  import CodeMirror from './input/codemirror/CodeMirror.svelte'
  import DropZone from './input/DropZone.svelte'
  import DateRange from './input/DateRange.svelte'
  import Emoji from './input/Emoji.svelte'
  import CLEditor from './input/CLEditor.svelte'
  import TableForm from './tableform/TableForm.svelte'
  import ArrayForm from './input/Array.svelte'
  import Url from './input/Url.svelte'
  import { IS_PRODUCTION } from '../../enums'
  export let value
  export let type = FormType.text
  export let label = ''
  export let required = false
  export let disabled = false
  export let description = ''
  export let props = {}
  export let doms = {}
  export let showKey
  const extraProps = {}
  if (type === FormType.select) {
    extraProps.multiSelect = false
  } else if (type === FormType.multi_select) {
    extraProps.multiSelect = true
  } else if (type === FormType.multi_select_bool_properties) {
    extraProps.multiSelect = true
    extraProps.boolprop = true
  }
  function getComponent() {
    switch (type) {
      case FormType.color:
        return Color
      case FormType.email:
        return Email
      case FormType.file:
        return File
      case FormType.hidden:
        return null
      case FormType.number:
        return Number
      case FormType.password:
        return Password
      case FormType.range:
        return Range
      case FormType.search:
        return Search
      case FormType.text:
        return Text
      case FormType.checkbox:
        return Checkbox
      case FormType.checkboxes:
        return Checkboxes
      case FormType.radio:
        return Radio
      case FormType.textarea:
        return Textarea
      case FormType.select:
        return TableForm
      case FormType.radio: //return radio
      case FormType.multi_select:
        return TableForm
      case FormType.text_array:
        return ArrayForm
      case FormType.multi_select_bool_properties:
        return TableForm
      case FormType.jsoneditor:
        return JsonEditor
      case FormType.codemirror:
        return CodeMirror
      case FormType.flatpicker:
        return Flatpicker
      case FormType.multi_select_hidden:
      case FormType.save_time:
      //return Empty
      case FormType.dropzone:
        return DropZone
      case FormType.daterange:
        return DateRange
      case FormType.cleditor:
        return CLEditor
      case FormType.emoji:
        return Emoji
      case FormType.url:
        return Url
      //case FormType.mindmap: return MindMap
      //case FormType.mapcountries: return MapCountries
      default:
        console.warn('Unknown Component type: ', type)
        return Hidden
    }
  }
  let comp = getComponent()
</script>

{#if comp && !(showKey && label !== ' key')}
  <div class="form-item">
    <svelte:component
      this={comp}
      bind:value
      name={label}
      {required}
      {disabled}
      bind:dom={doms}
      {...props}
      {...extraProps} />
    {#if description}
      {@html description}
    {/if}
  </div>
{/if}
