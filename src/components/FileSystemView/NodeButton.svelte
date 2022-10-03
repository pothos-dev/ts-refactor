<script lang="ts">
  import Button from '$components/Button.svelte'
  import IconText from '$components/IconText.svelte'
  import type { FileSystemNode } from '$types/FileSystem'

  let className: string
  export { className as class }
  export let node: FileSystemNode
</script>

<Button class={className} on:click>
  <div class="flex flex-row items-center">
    {node.relPath}
    <div class="flex-1" />
    <IconText
      class="w-12 justify-end"
      icon="carbon:export"
      text={node.meta.numExports}
    />
    <IconText
      class="w-12 justify-end"
      icon="codicon:symbol-method"
      text={node.meta.numSymbols}
    />
  </div>
</Button>
