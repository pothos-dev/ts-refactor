import { parseSymbols, type Symbol } from '$lib/parser/symbols'

export type Module = {
  path: string
  symbols: Symbol[]
}

export async function parseModule(path: string): Promise<Module> {
  const module: Module = { path, symbols: [] }
  module.symbols = await parseSymbols(path)
  return module
}
