import ts from 'typescript'
import { parseAstFromFile, walkAst } from '$lib/parser/util/typescript'
import { logger } from '$lib/logger'
import type { Symbol } from '$lib/parser/symbols'
import type { Module } from '$lib/parser/modules'

const log = logger('parser/exports', true)

export async function parseExports(module: Module): Promise<Symbol[]> {
  const symbols: Symbol[] = []

  walkAst(await parseAstFromFile(module.path), (node) => {
    // Entry node is a SourceFile, we should walk into it
    if (ts.isSourceFile(node)) return true

    // This is the special export declaration, which marks other
    // symbols in the file as exported (without those having the export
    // modifier themselves)
    if (ts.isExportDeclaration(node)) return true
    if (ts.isNamedExports(node)) return true
    if (ts.isExportSpecifier(node)) {
      const name = nodeName(node)
      if (name) {
        symbols.push({
          module,
          name,
          kind: 'unknown', // TODO detect symbol type
        })
      }
      return false
    }

    if (!isExported(node))
      // Exports will be at the top level of the file,
      // and must have an `export` modifier
      return false

    if (ts.isFunctionDeclaration(node)) {
      const name = nodeName(node)
      if (name) {
        symbols.push({ module, name, kind: 'function' })
        return false
      }
    }

    if (ts.isTypeAliasDeclaration(node)) {
      const name = nodeName(node)
      if (name) {
        symbols.push({ module, name, kind: 'type' })
        return false
      }
    }

    if (ts.isVariableStatement(node)) {
      node.declarationList.forEachChild((node) => {
        if (ts.isVariableDeclaration(node)) {
          const name = nodeName(node)
          if (name) {
            symbols.push({ module, name, kind: 'variable' })
          }
        }
      })
      return false
    }

    if (ts.isClassDeclaration(node)) {
      const name = nodeName(node)
      if (name) {
        symbols.push({ module, name, kind: 'class' })
        return false
      }
    }

    throw Error(`Unhandled exported node of type ${ts.SyntaxKind[node.kind]}`)
  })

  return symbols
}

function isExported(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) return false
  const mods = ts.getModifiers(node) ?? []
  return mods.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
}

function nodeName(node: ts.NamedDeclaration): string | undefined {
  const idNode = node.name
  if (idNode && ts.isIdentifier(idNode)) {
    return idNode.text
  }
  return undefined
}
