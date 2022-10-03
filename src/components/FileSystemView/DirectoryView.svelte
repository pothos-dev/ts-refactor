<script lang="ts">
  import DirectoryButton from '$components/FileSystemView/DirectoryButton.svelte'
  import FileButton from '$components/FileSystemView/FileButton.svelte'
  import type { DirectoryNode, FileSystemNode } from '$types/FileSystem'
  import { sortBy } from 'lodash'

  export let directoryNode: DirectoryNode
  $: nodes = sortBy(directoryNode.children, node => node.type)

  const selectNode = (node: FileSystemNode) => {
    if (node.type == 'directory') {
      directoryNode = node
    } else {
      // TODO
    }
  }
</script>

<div class="flex flex-col space-y-0">
  {#each nodes as node, i}
    {#if node.type == 'directory'}
      <DirectoryButton {node} on:click={() => selectNode(node)} />
    {/if}
    {#if node.type == 'file'}
      <FileButton {node} on:click={() => selectNode(node)} />
    {/if}
  {/each}
</div>
