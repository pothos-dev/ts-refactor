<script lang="ts">
  import Icon from '@iconify/svelte'

  export let icon: string
  export let text: string | number
  let clazz: string
  export { clazz as class }
</script>

<div class="flex flex-row items-center {clazz}">{text} <Icon {icon} /></div>
