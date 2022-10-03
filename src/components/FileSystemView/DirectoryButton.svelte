<script lang="ts">
  import NodeButton from '$components/FileSystemView/NodeButton.svelte'
  import type { DirectoryNode } from '$types/FileSystem'

  export let node: DirectoryNode
</script>

<NodeButton class="bg-blue-50" on:click {node} />
