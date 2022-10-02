import type { Symbol } from '$types/Symbol'

export type Module = {
  path: string
  symbols: Symbol[]
}

export type ModuleMetadata = {
  numSymbols: number
  numExports: number
}
