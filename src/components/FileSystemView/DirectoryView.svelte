<script lang="ts">
  import Button from '$components/Button.svelte'
  import type { DirectoryNode, FileSystemNode } from '$types/FileSystem'
  import { sortBy } from 'lodash'

  export let directoryNode: DirectoryNode
  $: nodes = sortBy(directoryNode.children, node => node.type)

  const onClick = (node: FileSystemNode) => {
    if (node.type == 'directory') {
      directoryNode = node
    } else {
      // TODO
    }
  }
</script>

<div class="flex flex-col space-y-0">
  {#each nodes as node, i}
    <Button
      class={node.type == 'directory' ? 'bg-blue-50' : 'bg-green-50'}
      on:click={() => onClick(node)}
    >
      {node.relPath}
    </Button>
  {/each}
</div>
