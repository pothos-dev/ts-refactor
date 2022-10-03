<script lang="ts">
  import NodeButton from '$components/FileSystemBrowser/NodeButton.svelte'
  import {
    isAncestorOrEqual,
    type DirectoryNode,
    type FileSystemNode,
  } from '$types/FileSystem'
  import { sortBy } from 'lodash'

  export let selectedNode: FileSystemNode
  export let viewedDirectory: DirectoryNode
  $: nodes = sortBy(viewedDirectory.children, node => node.type)

  const selectNode = (node: FileSystemNode) => {
    selectedNode = node
  }
  const classNames = (node: FileSystemNode) => {
    const color = node.type == 'directory' ? 'bg-blue-50' : 'bg-green-50'
    const border = isAncestorOrEqual(node, selectedNode)
      ? 'border border-solid border-black z-10 shadow-lg'
      : 'border border-solid border-transparent'

    return `${color} ${border}`
  }
</script>

<div class="flex flex-col space-y-0">
  {#each nodes as node}
    <NodeButton
      {node}
      class={classNames(node)}
      on:click={() => selectNode(node)}
    />
  {/each}
</div>
