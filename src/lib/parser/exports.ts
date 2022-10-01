import { logger } from '$lib/logger'
import { parseSymbols, type Symbol } from '$lib/parser/symbols'
import type { Module } from '$lib/parser/modules'

const log = logger('parser/exports', true)

export async function parseExports(module: Module): Promise<Symbol[]> {
  const symbols = await parseSymbols(module)
  return symbols.filter((symbol) => symbol.isExported)
}
