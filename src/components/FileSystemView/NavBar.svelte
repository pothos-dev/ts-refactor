<script lang="ts">
  import { getAncestors, type DirectoryNode } from '$types/FileSystem'
  import { reverse } from 'lodash'

  export let directoryNode: DirectoryNode
  $: nodes = reverse([directoryNode, ...getAncestors(directoryNode)])
</script>

<div class="flex flex-row items-center space-x-1">
  {#each nodes as node}
    <div
      class="bg-gray-200 p-1 cursor-pointer rounded-md"
      on:click={() => (directoryNode = node)}
    >
      {node.relPath}
    </div>
    <span class="text-xl">/</span>
  {/each}
</div>
