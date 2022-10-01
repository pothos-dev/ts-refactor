import type { Module } from '$lib/parser/modules'

export type Symbol = {
  module: Module
  name: string
  kind: 'function' | 'class' | 'variable' | 'type' | 'unknown'
}
