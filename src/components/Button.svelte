<script lang="ts">
  let className = ''
  export { className as class }
</script>

<div
  class="p-1 border cursor-pointer shadow-md border-transparent hover:z-10 {className}"
  on:click
>
  <slot />
</div>
