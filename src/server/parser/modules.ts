import { parseSymbols } from '$server/parser/symbols'
import type { Module, ModuleMetadata } from '$types/Module'

export async function parseModule(path: string): Promise<Module> {
  const module: Module = {
    path,
    symbols: [],
  }

  module.symbols = await parseSymbols(path)

  return module
}

export function getMetadata(module: Module): ModuleMetadata {
  return {
    numSymbols: module.symbols.length,
    numExports: module.symbols.filter(s => s.isExported).length,
  }
}

export function mergeMetadata(
  a: ModuleMetadata,
  b: ModuleMetadata
): ModuleMetadata {
  return {
    numSymbols: a.numSymbols + b.numSymbols,
    numExports: a.numExports + b.numExports,
  }
}
