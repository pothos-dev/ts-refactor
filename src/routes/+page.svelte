<script lang="ts">
  import type { DirectoryNode, FileSystemNode } from '$lib/parser/files'
  import type { PageData } from './$types'
  export let data: PageData

  let rootNode: DirectoryNode = data.fileSystemNode
  $: navPathElements = rootNode.path.split('/').filter(Boolean)

  function selectNode(node: FileSystemNode) {
    if (node.type == 'directory') {
      rootNode = node
    }
  }
</script>

<div class="flex flex-col p-4 space-y-1 items-start">
  <!-- Nav Bar -->
  <div class="flex flex-row items-center space-x-1">
    {#each navPathElements as el}
      <div class=" bg-slate-400 p-1">{el}</div>
      <span class="text-xl">/</span>
    {/each}
  </div>

  <!-- Module List -->
  {#each rootNode.children as childNode}
    <div
      class="border border-solid border-black p-1"
      on:click={() => selectNode(childNode)}
    >
      {childNode.relPath}
    </div>
  {/each}
</div>
