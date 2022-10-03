<script lang="ts">
  import Button from '$components/Button.svelte'
  import { getAncestorsOrEqual, type FileSystemNode } from '$types/FileSystem'
  import { reverse } from 'lodash'

  export let selectedNode: FileSystemNode
  $: nodes = reverse(getAncestorsOrEqual(selectedNode))
</script>

<div class="flex flex-row items-center space-x-1">
  {#each nodes as node}
    <Button class="bg-blue-200" on:click={() => (selectedNode = node)}>
      {node.relPath}
    </Button>
    <span class="text-xl">/</span>
  {/each}
</div>
