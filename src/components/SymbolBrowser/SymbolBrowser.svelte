<script lang="ts">
  import { getDescendantsOrEqual, type FileSystemNode } from '$types/FileSystem'

  export let selectedNode: FileSystemNode
  $: symbols = getDescendantsOrEqual(selectedNode).flatMap(node =>
    node.type == 'file' ? node.module.symbols : []
  )
</script>

<div class="border border-black border-solid w-96">
  {#each symbols as symbol}
    <div class="border border-black border-solid">
      {symbol.name}
    </div>
  {/each}
</div>
