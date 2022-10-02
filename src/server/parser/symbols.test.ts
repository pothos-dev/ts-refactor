import { parseSymbols } from '$server/parser/symbols'
import { describe, expect, it } from 'vitest'

describe('sybols parser', () => {
  it('should parse symbols', async () => {
    const symbols = await parseSymbols(
      '/workspaces/ts-refactor/test/exportModule.ts'
    )

    expect(symbols).toEqual([
      { name: 'Foo', kind: 'type', isExported: true },
      { name: 'Bar', kind: 'type', isExported: true },
      { name: 'createFoo', kind: 'function', isExported: true },
      { name: 'foo', kind: 'variable', isExported: true },
      { name: 'foo2', kind: 'variable', isExported: true },
      { name: 'foo3', kind: 'variable', isExported: true },
      { name: 'FooClass', kind: 'class', isExported: true },
      { name: 'default', kind: 'variable', isExported: true },
    ])
  })
})
