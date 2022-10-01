import { parseModule, type Module } from '$lib/parser/modules'
import {
  findTsConfig,
  findIncludedSourcePaths,
  parseTsConfig,
} from '$lib/parser/tsconfig'
import { getAncestorDirectoryPaths } from '$lib/parser/util/path'
import path from 'path'

export type FileSystemNode = FileNode | DirectoryNode
export type FileNode = {
  type: 'file'
  path: string
  relPath: string
  module: Module
}
export type DirectoryNode = {
  type: 'directory'
  path: string
  relPath: string
  children: FileSystemNode[]
}

export async function parseFileSystemNode(
  searchPath: string
): Promise<DirectoryNode> {
  const directories: Record<string, DirectoryNode> = {}

  const modules = await parseAllSourceModules(searchPath)
  for (const module of modules) {
    const fileNode: FileNode = {
      type: 'file',
      path: module.path,
      relPath: path.basename(module.path),
      module,
    }

    let currentNode: FileSystemNode = fileNode
    for (const dirPath of getAncestorDirectoryPaths(fileNode.path)) {
      if (module.path == '/workspaces/ts-refactor/src/lib/parser/files.ts') {
        console.log(dirPath)
      }

      let dirNode: DirectoryNode = directories[dirPath]

      if (dirNode) {
        dirNode.children.push(currentNode)
        break
      }

      if (!dirNode) {
        dirNode = {
          type: 'directory',
          path: dirPath,
          relPath: path.basename(dirPath),
          children: [currentNode],
        }
        directories[dirPath] = dirNode
      }

      currentNode = dirNode
    }
  }

  return directories['/']
}

export async function parseAllSourceModules(
  searchPath: string
): Promise<Module[]> {
  const sourceFilePaths = await findAllSourceFiles(searchPath)
  return Promise.all(sourceFilePaths.map(parseModule))
}

async function findAllSourceFiles(searchPath: string): Promise<string[]> {
  const tsConfigPath = await findTsConfig(searchPath)
  const tsConfig = await parseTsConfig(tsConfigPath)
  return await findIncludedSourcePaths(tsConfig)
}
