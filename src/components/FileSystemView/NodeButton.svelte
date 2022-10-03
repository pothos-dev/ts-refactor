<script lang="ts">
  import Button from '$components/Button.svelte'
  import IconText from '$components/IconText.svelte'
  import type { FileSystemNode } from '$types/FileSystem'

  let clazz: string
  export { clazz as class }
  export let node: FileSystemNode
</script>

<Button class={clazz} on:click>
  <div class="flex flex-row items-center">
    {node.relPath}
    <div class="flex-1" />
    <IconText class="ml-2" icon="carbon:export" text={node.meta.numExports} />
    <IconText
      class="ml-2"
      icon="codicon:symbol-method"
      text={node.meta.numSymbols}
    />
  </div>
</Button>
