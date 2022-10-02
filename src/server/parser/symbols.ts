import ts from 'typescript'
import { parseAstFromFile, walkAst } from '$server/parser/util/typescript'
import { find } from 'lodash'
import type { Symbol } from '$types/Symbol'

export async function parseSymbols(path: string): Promise<Symbol[]> {
  const symbols: Symbol[] = []

  const sourceFile = await parseAstFromFile(path)

  // First pass: collect all top-level symbols
  walkAst(sourceFile, node => {
    // Entry node is a SourceFile, we should walk into it
    if (ts.isSourceFile(node)) return true

    // type or interface
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      symbols.push({
        kind: 'type',
        name: nodeName(node),
        isExported: nodeIsExported(node),
      })
      return false
    }

    // function
    if (ts.isFunctionDeclaration(node)) {
      symbols.push({
        kind: 'function',
        name: nodeName(node),
        isExported: nodeIsExported(node),
      })
      return false
    }

    // class
    if (ts.isClassDeclaration(node)) {
      symbols.push({
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
      node.declarationList.forEachChild(node => {
        if (ts.isVariableDeclaration(node)) {
          symbols.push({
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

    // These we don't are about
    if (ts.isBlock(node)) return false
    if (ts.isExpressionStatement(node)) return false
    if (ts.isModuleDeclaration(node)) return false
    if (ts.isImportDeclaration(node)) return false
    if (ts.isToken(node)) return false
    if (ts.isLabeledStatement(node)) return false

    throw Error(`Unhandled node ${ts.SyntaxKind[node.kind]} in ${path}`)
  })

  // Second pass: find named or default exports
  walkAst(sourceFile, node => {
    // Entry node is a SourceFile, we should walk into it
    if (ts.isSourceFile(node)) return true

    // This is the default export
    if (ts.isExportAssignment(node)) {
      node.forEachChild(node => {
        if (ts.isIdentifier(node)) {
          symbols.push({
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
  return mods.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)
}
