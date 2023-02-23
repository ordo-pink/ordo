// import {
//   BinaryFn,
//   IOrdoDirectory,
//   IOrdoFile,
//   Nullable,
//   OrdoDirectory,
//   OrdoFile,
//   UnaryFn,
// } from "@ordo-pink/core"

// export type NodeID = string

// export interface INode<T = unknown> {
//   readonly id: NodeID
//   readonly depth: number
//   readonly value: T
// }

// export interface IOrdoFileNode extends INode<IOrdoFile> {
//   readonly parent: IOrdoDirectoryNode
// }

// export interface IOrdoRootNode extends INode<IOrdoDirectory> {
//   readonly children: Array<IOrdoFileNode | IOrdoDirectoryNode>
//   appendChild: UnaryFn<IOrdoFile | IOrdoDirectory, IOrdoDirectoryNode>
//   removeChild: UnaryFn<NodeID, IOrdoDirectoryNode>
//   replaceChild: UnaryFn<{ id: NodeID; newEntity: IOrdoFile | IOrdoDirectory }, IOrdoDirectoryNode>
//   getChild: UnaryFn<NodeID, Nullable<IOrdoFileNode | IOrdoDirectoryNode>>
//   getChildRec: UnaryFn<NodeID, Nullable<IOrdoFileNode | IOrdoDirectoryNode>>
// }

// export interface IOrdoDirectoryNode extends IOrdoRootNode {
//   readonly parent: IOrdoDirectoryNode
// }

// export type INodeStatic = {
//   of: <T extends IOrdoFile | IOrdoDirectory>(
//     x: T,
//     parent: IOrdoDirectoryNode,
//   ) => T extends IOrdoFile ? IOrdoFileNode : IOrdoDirectoryNode
//   root: UnaryFn<IOrdoDirectory, IOrdoRootNode>
//   file: BinaryFn<IOrdoFile, IOrdoDirectoryNode, IOrdoFileNode>
//   directory: BinaryFn<IOrdoDirectory, IOrdoDirectoryNode, IOrdoDirectoryNode>
//   isFileNode: (x: unknown) => x is IOrdoFileNode
//   isDirectoryNode: (x: unknown) => x is IOrdoDirectoryNode
//   isRootNode: (x: unknown) => x is IOrdoRootNode
// }

// const directory = (value: IOrdoDirectory, parent: IOrdoDirectoryNode): IOrdoDirectoryNode => {
//   const id = value.raw.path
//   const self = directory(value, parent)

//   const children = value.children.map((child) =>
//     OrdoFile.isOrdoFile(child) ? OrdoFsNode.file(child, self) : OrdoFsNode.directory(child, self),
//   )
//   const depth = value.raw.path.split("/").filter(Boolean).length

//   return {
//     get id() {
//       return id
//     },
//     get value() {
//       return value
//     },
//     get children() {
//       return children
//     },
//     get depth() {
//       return depth
//     },
//     get parent() {
//       return parent
//     },
//     appendChild: (child) => {
//       const childNode = OrdoFsNode.of(child, self)

//       return ()

//       OrdoFsNode.directory({
//         ...value,
//         children: children.concat(childNode),
//       }, parent)
//     },
//     getChild: (path) => children.find((child) => child.id === path) ?? null,
//     getChildRec: (path) => {
//       if (!path.startsWith(id)) {
//         return null
//       }

//       let parent: Nullable<IOrdoDirectoryNode> = OrdoFsNode.directory(value)
//       const pathChunks = path.split("/").filter(Boolean)

//       for (const chunk of pathChunks) {
//         if (!parent || !OrdoFsNode.isDirectoryNode(parent)) {
//           parent = null
//           break
//         }

//         let child = parent.getChild(`${parent.id}/${chunk}/`)
//         if (!child) {
//           child = parent.getChild(`${parent.id}/${chunk}`)
//         }

//         parent = (child as IOrdoDirectoryNode) ?? null
//       }

//       return parent
//     },
//     removeChild: (id) => {},
//   }
// }

// export const OrdoFsNode: INodeStatic = {
//   of: (value: IOrdoFile | IOrdoDirectory) =>
//     OrdoDirectory.isOrdoDirectory(value) ? OrdoFsNode.branch(value) : OrdoFsNode.child(value),
// }
