<script lang="ts">
  import type { PageData } from './$types'
  import type { DirectoryNode, FileSystemNode } from '$types/FileSystem'
  import NavBar from './NavBar.svelte'

  export let data: PageData
  let rootNode: DirectoryNode = data.fileSystemNode

  function selectNode(node: FileSystemNode) {
    if (node.type == 'directory') {
      rootNode = node
    }
  }
</script>

<div class="flex flex-col p-4 space-y-1 items-start">
  <NavBar bind:rootNode />

  {#each rootNode.children as childNode}
    <div
      class="border border-solid border-black p-1"
      on:click={() => selectNode(childNode)}
    >
      {childNode.relPath}
    </div>
  {/each}
</div>
