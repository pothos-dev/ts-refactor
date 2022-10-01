import { parseExports } from '$lib/parser/exports'
import { describe, expect, it } from 'vitest'

describe('exports parser', () => {
  it('should parse exports', async () => {
    const module = {
      path: '/workspaces/ts-refactor/src/test/exportModule.ts',
    }
    const exports = await parseExports(module)
    expect(exports).toEqual([
      { module, name: 'Foo', kind: 'type' },
      { module, name: 'createFoo', kind: 'function' },
      { module, name: 'foo', kind: 'variable' },
      { module, name: 'foo2', kind: 'variable' },
      { module, name: 'foo3', kind: 'variable' },
      { module, name: 'FooClass', kind: 'class' },
    ])
  })
})
