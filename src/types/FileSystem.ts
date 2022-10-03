import type { Module, ModuleMetadata } from '$types/Module'

export type FileSystemNode = FileNode | DirectoryNode
export type FileNode = {
  type: 'file'
  module: Module

  path: string
  relPath: string
  parent: DirectoryNode

  meta: ModuleMetadata
}
export type DirectoryNode = {
  type: 'directory'
  children: FileSystemNode[]

  path: string
  relPath: string
  parent: DirectoryNode | null

  meta: ModuleMetadata
}

// Returns the ancestors of the given path, direct parent first.
export function getAncestors(node: FileSystemNode): DirectoryNode[] {
  const ancestors: DirectoryNode[] = []
  let parent = node.parent
  while (parent) {
    ancestors.push(parent)
    parent = parent.parent
  }
  return ancestors
}

// Returns true if `node` is an ancestor of `other`.
export function isAncestorOrEqual(
  node: DirectoryNode,
  other: DirectoryNode
): boolean {
  return node == other || getAncestors(other).includes(node)
}
