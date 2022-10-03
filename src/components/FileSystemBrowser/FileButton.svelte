<script lang="ts">
  import NodeButton from '$components/FileSystemBrowser/NodeButton.svelte'
  import type { FileNode } from '$types/FileSystem'

  export let node: FileNode
</script>

<NodeButton class="bg-green-50" on:click {node} />
