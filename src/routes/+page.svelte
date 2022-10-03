<script lang="ts">
  import type { PageData } from './$types'
  import type { DirectoryNode } from '$types/FileSystem'
  import FileSystemBrowser from '$components/FileSystemBrowser/FileSystemBrowser.svelte'
  import SymbolBrowser from '$components/SymbolBrowser/SymbolBrowser.svelte'

  export let data: PageData
  let selectedNode: DirectoryNode = data.fileSystemNode
</script>

<div class="absolute left-0 top-0 right-0 bottom-0">
  <div class="flex flex-row justify-between h-full">
    <FileSystemBrowser bind:selectedNode />
    <SymbolBrowser {selectedNode} />
  </div>
</div>
