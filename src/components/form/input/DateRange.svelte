<script lang="ts">
  /**
   * USED FOR DEVELOPMENT OF COMPONENT ONLY.
   *
   * Using a svelte wrapper component to manage state allows for svelte-style
   * reactivity, rather than using foobar.$on() and foobar.$set()
   */
  import {
    addHours,
    endOfWeek,
    startOfWeek,
    startOfDay,
    endOfDay
  } from 'date-fns'
  import Label from '../Label.svelte'
  import * as locales from 'date-fns/locale'
  import SDateRangePicker from '../../../../thirdparty/s-date-range-picker/src/date-range-picker/SDateRangePicker.svelte'
  export let name
  const random = false
  const localesArray = Object.keys(locales).map(i => locales[i])
  const locale = random
    ? localesArray[Math.floor(Math.random() * localesArray.length)]
    : undefined
  const singlePicker = false
  let startDate = singlePicker
    ? startOfDay(new Date())
    : startOfWeek(new Date())
  let endDate = singlePicker ? startDate : endOfWeek(new Date())
  let monthDropdown = random ? Boolean(Math.floor(Math.random() * 2)) : true
  let yearDropdown = random ? Boolean(Math.floor(Math.random() * 2)) : true
  let todayBtn = random ? Boolean(Math.floor(Math.random() * 2)) : true
  let resetViewBtn = random ? Boolean(Math.floor(Math.random() * 2)) : true
  const maxDate = undefined

  function onApply({ detail }) {
    startDate = detail.startDate
    endDate = detail.endDate
    //console.log('onApply: ', detail)
  }
</script>

<Label {name} />
<SDateRangePicker
  {maxDate}
  weekGuides
  weekNumbers
  todayBtn
  {locale}
  twoPages
  resetViewBtn
  timePicker
  timePickerSeconds
  timePickerControls
  {startDate}
  {endDate}
  on:apply={onApply} />
