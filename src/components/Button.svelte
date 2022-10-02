<script lang="ts">
  let clazz = ''
  export { clazz as class }
</script>

<div
  class="p-1 border cursor-pointer shadow-md border-transparent hover:border-gray-700 hover:z-10 {clazz}"
  on:click
>
  <slot />
</div>
