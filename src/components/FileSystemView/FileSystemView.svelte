<script lang="ts">
  import NavBar from '$components/FileSystemView/NavBar.svelte'
  import DirectoryView from '$components/FileSystemView/DirectoryView.svelte'
  import type { DirectoryNode } from '$types/FileSystem'

  export let directoryNode: DirectoryNode
</script>

<div class="flex flex-col p-4 space-y-1 items-start">
  <NavBar bind:directoryNode />
  <DirectoryView bind:directoryNode />
</div>
