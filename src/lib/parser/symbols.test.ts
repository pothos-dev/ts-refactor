import { parseSymbols } from '$lib/parser/symbols'
import { describe, expect, it } from 'vitest'

describe('sybols parser', () => {
  it('should parse symbols', async () => {
    const module = {
      path: '/workspaces/ts-refactor/src/test/exportModule.ts',
    }
    const symbols = await parseSymbols(module)

    expect(symbols).toEqual([
      { module, name: 'Foo', kind: 'type', isExported: true },
      { module, name: 'Bar', kind: 'type', isExported: true },
      { module, name: 'createFoo', kind: 'function', isExported: true },
      { module, name: 'foo', kind: 'variable', isExported: true },
      { module, name: 'foo2', kind: 'variable', isExported: true },
      { module, name: 'foo3', kind: 'variable', isExported: true },
      { module, name: 'FooClass', kind: 'class', isExported: true },
      { module, name: 'default', kind: 'variable', isExported: true },
    ])
  })
})
