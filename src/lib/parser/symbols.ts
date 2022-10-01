import ts from 'typescript'
import type { Module } from '$lib/parser/modules'
import { parseAstFromFile, walkAst } from '$lib/parser/util/typescript'
import { find } from 'lodash'

export type Symbol = {
  module: Module
  name: string
  kind: 'function' | 'class' | 'variable' | 'type'
  isExported: boolean
}

export async function parseSymbols(module: Module) {
  const symbols: Symbol[] = []

  const sourceFile = await parseAstFromFile(module.path)

  // First pass: collect all top-level symbols
  walkAst(sourceFile, (node) => {
    // Entry node is a SourceFile, we should walk into it
    if (ts.isSourceFile(node)) return true

    // type or interface
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      symbols.push({
        module,
        kind: 'type',
        name: nodeName(node),
        isExported: nodeIsExported(node),
      })
      return false
    }

    // function
    if (ts.isFunctionDeclaration(node)) {
      symbols.push({
        module,
        kind: 'function',
        name: nodeName(node),
        isExported: nodeIsExported(node),
      })
      return false
    }

    // class
    if (ts.isClassDeclaration(node)) {
      symbols.push({
        module,
        kind: 'class',
        name: nodeName(node),
        isExported: nodeIsExported(node),
      })
      return false
    }

    // variable(s)
    if (ts.isVariableStatement(node)) {
      // A variable statement can export multiple symbols at once.
      // All of them share the `isExported` flag of the statement.
      const isExported = nodeIsExported(node)
      node.declarationList.forEachChild((node) => {
        if (ts.isVariableDeclaration(node)) {
          symbols.push({
            module,
            kind: 'variable',
            name: nodeName(node),
            isExported,
          })
        }
      })
      return false
    }

    // This will be handled in second pass
    if (ts.isExportAssignment(node)) return false
    if (ts.isExportDeclaration(node)) return false

    // EndOfFileToken?
    if (ts.isToken(node)) return false

    throw Error(`Unhandled node type: ${ts.SyntaxKind[node.kind]}`)
  })

  // Second pass: find named or default exports
  walkAst(sourceFile, (node) => {
    // Entry node is a SourceFile, we should walk into it
    if (ts.isSourceFile(node)) return true

    // This is the default export
    if (ts.isExportAssignment(node)) {
      node.forEachChild((node) => {
        if (ts.isIdentifier(node)) {
          symbols.push({
            module,
            kind: 'variable', // TODO could be something else
            name: 'default',
            isExported: true,
          })
        }
      })
    }

    // This exports one or more existing symbols
    if (ts.isExportDeclaration(node)) return true
    if (ts.isNamedExports(node)) return true
    if (ts.isExportSpecifier(node)) {
      const symbol = find(symbols, { name: nodeName(node) })!
      symbol.isExported = true
    }

    return false
  })
  // TODO

  return symbols
}

function nodeName(node: ts.NamedDeclaration): string {
  const idNode = node.name
  if (idNode && ts.isIdentifier(idNode)) {
    return idNode.text
  }
  return '<anonymous>'
}

function nodeIsExported(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) return false
  const mods = ts.getModifiers(node) ?? []
  return mods.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
}
