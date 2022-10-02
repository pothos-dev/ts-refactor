<script lang="ts">
  import type { DirectoryNode, FileSystemNode } from '$types/FileSystem'

  export let directoryNode: DirectoryNode
  const onClick = (node: FileSystemNode) => {
    if (node.type == 'directory') {
      directoryNode = node
    } else {
      // TODO
    }
  }
</script>

{#each directoryNode.children as node}
  <div
    class="border border-solid border-black p-1"
    on:click={() => onClick(node)}
  >
    {node.relPath}
  </div>
{/each}
