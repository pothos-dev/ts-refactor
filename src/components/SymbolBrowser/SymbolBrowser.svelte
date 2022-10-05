<script lang="ts">
  import Button from '$components/Button.svelte'
  import IconText from '$components/IconText.svelte'
  import { getDescendantsOrEqual, type FileSystemNode } from '$types/FileSystem'

  export let selectedNode: FileSystemNode
  $: symbols = getDescendantsOrEqual(selectedNode).flatMap(node =>
    node.type == 'file' ? node.module.symbols : []
  )
</script>

<div class="w-96 shadow-xl border-l border-solid border-gray-300">
  {#each symbols as symbol}
    <Button>
      <IconText
        leftIcon={symbol.isExported ? 'carbon:export' : ''}
        text={symbol.name}
      />
    </Button>
  {/each}
</div>
