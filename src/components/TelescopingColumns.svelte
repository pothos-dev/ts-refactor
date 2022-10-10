<script lang="ts">
  import { afterUpdate, onMount } from 'svelte'

  let outerContainer: HTMLDivElement
  let innerContainer: HTMLDivElement

  function onResize() {
    let outerWidth = outerContainer.clientWidth
    let innerWidth = innerContainer.scrollWidth
    let numItems = innerContainer.children.length
    let dx = (innerWidth - outerWidth) / (numItems - 1)
    if (dx <= 0) dx = 0

    for (let i = 0; i < numItems; i++) {
      let item = innerContainer.children[i] as HTMLDivElement
      item.style.transform = `translateX(-${i * dx}px)`
    }
  }

  onMount(() => onResize())
  afterUpdate(() => onResize())
</script>

<div
  bind:this={outerContainer}
  class="max-w-screen-sm border border-black border-solid"
>
  <div bind:this={innerContainer} class="flex flex-row">
    <slot />
  </div>
</div>
