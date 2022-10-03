<script lang="ts">
  import NodeButton from '$components/FileSystemView/NodeButton.svelte'
  import type { DirectoryNode } from '$types/FileSystem'

  export let node: DirectoryNode
  export let bordered: boolean = false
</script>

<NodeButton
  class="bg-blue-50 border border-solid {bordered
    ? 'border-black'
    : 'border-transparent'}"
  on:click
  {node}
/>
