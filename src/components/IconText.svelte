<script lang="ts">
  import Icon from '@iconify/svelte'

  export let icon: string
  export let text: string | number
  let className: string
  export { className as class }
</script>

<div class="flex flex-row items-center {className}">{text} <Icon {icon} /></div>
