<script lang="ts">
  import type { PageData } from './$types'
  import type { DirectoryNode } from '$types/FileSystem'
  import FileSystemView from '$components/FileSystemView/FileSystemView.svelte'

  export let data: PageData
  let selectedDirectory: DirectoryNode = data.fileSystemNode
</script>

<FileSystemView bind:selectedDirectory />
