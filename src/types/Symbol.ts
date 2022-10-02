export type Symbol = {
  name: string
  kind: 'function' | 'class' | 'variable' | 'type'
  isExported: boolean
  exportedName?: string
}
