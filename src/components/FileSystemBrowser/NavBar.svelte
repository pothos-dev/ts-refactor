<script lang="ts">
  import Button from '$components/Button.svelte'
  import { getAncestors, type DirectoryNode } from '$types/FileSystem'
  import { reverse } from 'lodash'

  export let directoryNode: DirectoryNode
  $: nodes = reverse([directoryNode, ...getAncestors(directoryNode)])
</script>

<div class="flex flex-row items-center space-x-1">
  {#each nodes as node}
    <Button class="bg-blue-200" on:click={() => (directoryNode = node)}>
      {node.relPath}
    </Button>
    <span class="text-xl">/</span>
  {/each}
</div>
