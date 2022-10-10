<script lang="ts">
  import NavBar from '$components/FileSystemBrowser/NavBar.svelte'
  import DirectoryView from '$components/FileSystemBrowser/DirectoryView.svelte'
  import { getAncestorsOrEqual, type FileSystemNode } from '$types/FileSystem'
  import { reverse } from 'lodash'
  import TelescopingColumns from '$components/TelescopingColumns.svelte'

  export let selectedNode: FileSystemNode
  $: nodes = reverse(getAncestorsOrEqual(selectedNode))
</script>

<div class="flex flex-col p-4 space-y-1 items-start">
  <NavBar bind:selectedNode />

  <TelescopingColumns>
    {#each nodes as node}
      {#if node.type == 'directory'}
        <DirectoryView bind:selectedNode viewedDirectory={node} />
      {/if}
    {/each}
  </TelescopingColumns>
</div>
