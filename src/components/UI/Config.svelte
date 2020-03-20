<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { flip } from 'svelte/animate'
  import { S } from '../../ws_events_dispatcher'
  import { ET, E } from '../../events'
  import { quintOut } from 'svelte/easing'
  import { crossfade } from 'svelte/transition'
  import SubmitButton from '../form/SubmitButton.svelte'
  import CancelButton from '../form/CancelButton.svelte'
  import Error from '../UI/Error.svelte'
  export let schema_key = ''
  const dp = createEventDispatcher()
  // FLIP ANIMATION
  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),
    fallback(node, params) {
      const style = getComputedStyle(node)
      const transform = style.transform === 'none' ? '' : style.transform
      return {
        duration: 300,
        easing: quintOut,
        css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
      }
    }
  })
  // DRAG AND DROP
  let isOver = false
  const getDraggedParent = node =>
    node.dataset && node.dataset.index
      ? node.dataset
      : getDraggedParent(node.parentNode)
  const start = ev => {
    // console.log("start", ev);
    // dataset: DOMStringMap
    // id: ""Key""
    // index: "0"
    ev.dataTransfer.setData('source', ev.target.dataset.index)
  }
  const over = ev => {
    // console.log("over")
    const isFromList = ev.dataTransfer.types.includes('source')
    if (isFromList) {
      let dragged = getDraggedParent(ev.target)
      if (disabledDndIdx.includes(Number(dragged.index))) return
      if (isOver !== dragged.id) isOver = dragged.id
      ev.preventDefault()
    }
  }
  const leave = ev => {
    // console.log("leave")
    let dragged = getDraggedParent(ev.target)
    if (isOver === dragged.id) isOver = false
  }
  const drop = ev => {
    // console.log("drop")
    isOver = false
    ev.preventDefault()
    let dragged = getDraggedParent(ev.target)
    let from = ev.dataTransfer.getData('source')
    let to = dragged.index
    if (sortMode === 'insert') {
      insertSort({ from, to })
    } else {
      swapSort({ from, to })
    }
  }
  // DISPATCH REORDER
  const insertSort = ({ from, to }) => {
    if (from === to) {
      return //Don't do anything
    }
    let newList = [...list]
    const movedItem = { ...newList[from] }
    newList = []
    list.forEach((item, i) => {
      if (i === Number(from)) {
        //Skip old position of movedItem
        return
      }
      if (i === Number(to)) {
        //Insert movedItem
        if (Number(to) > Number(from)) {
          newList = newList.concat([{ ...item }, movedItem])
        } else {
          newList = newList.concat([movedItem, { ...item }])
        }
      } else {
        newList = newList.concat([{ ...item }])
      }
    })
    list = newList
    dp('sort', newList)
  }
  const swapSort = ({ from, to }) => {
    let newList = [...list]
    newList[from] = [newList[to], (newList[to] = newList[from])][0]
    list = newList
    dp('sort', newList)
  }
  // UTILS
  const getKey = item => (key_ ? item[key_] : item)
  // PROPS
  let list = []
  let sortMode = 'insert'
  let key_ = 'form_label'
  let disabledDndIdx = [0]
  let er = ''
  let isSaving = false
  onMount(async () => {
    const d = await new Promise((resolve, reject) => {
      S.bindT(
        [ET.get, E.my_schema_get, S.uid],
        d => {
          resolve(d)
        },
        [schema_key]
      )
    }, 0)
    list = d
  })
  async function onSave() {
    isSaving = true
    const d = await new Promise((resolve, reject) => {
      S.bindT(
        [ET.insert, E.my_schema_mutate, S.uid],
        d => {
          resolve(d)
        },
        [schema_key, { columns: list }]
      )
    }, 0)
    isSaving = false
    if (d.ok) {
      er = 'Settings saved'
      setTimeout(function() {
        er = ''
      }, 1500)
      // dp("successSave", { key, d });
    } else {
      er = d.error
    }
  }
  // {JSON.stringify(list)}
</script>

<form on:submit|preventDefault={onSave}>
  {#if list && list.length}
    <ul>
      {#each list as item, index (getKey(item))}
        <li
          data-index={index}
          data-id={getKey(item)}
          draggable={disabledDndIdx.includes(index) ? 'false' : 'true'}
          on:dragstart={start}
          on:dragover={over}
          on:dragleave={leave}
          on:drop={drop}
          in:receive={{ key: getKey(item) }}
          out:send={{ key: getKey(item) }}
          animate:flip={{ duration: 300 }}
          class:over={getKey(item) === isOver}>
          {#if true}
            <input type="checkbox" bind:checked={item.isVisible} />
          {/if}
          {item.form_label}
        </li>
      {/each}
    </ul>
  {/if}
  <Error {er} />
  <footer>
    <SubmitButton {isSaving} title="Save current changes" />
    <button
      type="button"
      disabled={isSaving}
      on:click={() => dp('configApply', { list })}
      title="Apply changes without saving">
      Apply
    </button>
    {#if false}
      <button type="button" disabled={isSaving} on:close>Restore</button>
    {/if}
    <CancelButton {isSaving} on:close />
  </footer>
</form>
