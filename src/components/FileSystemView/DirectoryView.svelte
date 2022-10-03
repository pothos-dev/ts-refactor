<script lang="ts">
  import DirectoryButton from '$components/FileSystemView/DirectoryButton.svelte'
  import FileButton from '$components/FileSystemView/FileButton.svelte'
  import {
    isAncestorOrEqual,
    type DirectoryNode,
    type FileSystemNode,
  } from '$types/FileSystem'
  import { sortBy } from 'lodash'

  export let selectedDirectory: DirectoryNode
  export let viewedDirectory: DirectoryNode
  $: nodes = sortBy(viewedDirectory.children, node => node.type)

  const selectNode = (node: FileSystemNode) => {
    if (node.type == 'directory') {
      selectedDirectory = node
    } else {
      // TODO
    }
  }
</script>

<div class="flex flex-col space-y-0">
  {#each nodes as node, i}
    {#if node.type == 'directory'}
      <DirectoryButton
        {node}
        on:click={() => selectNode(node)}
        bordered={isAncestorOrEqual(node, selectedDirectory)}
      />
    {/if}
    {#if node.type == 'file'}
      <FileButton {node} on:click={() => selectNode(node)} />
    {/if}
  {/each}
</div>
