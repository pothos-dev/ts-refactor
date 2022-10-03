<script lang="ts">
  import NavBar from '$components/FileSystemBrowser/NavBar.svelte'
  import DirectoryView from '$components/FileSystemBrowser/DirectoryView.svelte'
  import { getAncestors, type DirectoryNode } from '$types/FileSystem'
  import { reverse } from 'lodash'

  export let selectedDirectory: DirectoryNode
  $: dirs = reverse([selectedDirectory, ...getAncestors(selectedDirectory)])
</script>

<div class="flex flex-col p-4 space-y-1 items-start">
  <NavBar bind:directoryNode={selectedDirectory} />
  <div class="flex flex-row">
    {#each dirs as dir}
      <DirectoryView viewedDirectory={dir} bind:selectedDirectory />
    {/each}
  </div>
</div>
