export type Symbol = {
  name: string
  kind: 'function' | 'class' | 'variable' | 'type' | 'import'
  isExported: boolean
  exportedName?: string
  importedName?: string
  importedFrom?: string
}
