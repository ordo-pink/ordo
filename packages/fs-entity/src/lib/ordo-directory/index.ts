import {
  IOrdoDirectoryRaw,
  IOrdoDirectory,
  OrdoFsEntity,
  IOrdoDirectoryStatic,
  OrdoDirectoryPath,
  IOrdoFile,
} from "@ordo-pink/common-types"
import { isValidPath, endsWithSlash } from "../common"
import { OrdoFile } from "../ordo-file"

const ordoDirectory = (raw: IOrdoDirectoryRaw): IOrdoDirectory => {
  if (!OrdoDirectory.isValidPath(raw.path)) {
    throw new TypeError("Invalid directory path")
  }

  const readableName = OrdoDirectory.getReadableName(raw.path)

  const children = [] as OrdoFsEntity[]

  for (const child of raw.children) {
    if (OrdoDirectory.isOrdoDirectoryRaw(child)) {
      children.push(OrdoDirectory.of(child))
    } else if (OrdoFile.isOrdoFileRaw(child)) {
      children.push(OrdoFile.of(child))
    }
  }

  OrdoDirectory.sort(children)

  return {
    readableName,
    children,
    path: raw.path,
    metadata: raw.metadata,
    findDirectory: (path) =>
      (children.find(
        (child) => child.path === path && OrdoDirectory.isOrdoDirectory(child),
      ) as IOrdoDirectory) ?? null,
    findFile: (path) =>
      (children.find((child) => child.path === path && OrdoFile.isOrdoFile(child)) as IOrdoFile) ??
      null,
    findFileDeep: (path) => {
      const found = children.find((child) => child.path === path)

      if (!found || OrdoDirectory.isOrdoDirectory(found)) return null

      return found
    },
    findDirectoryDeep: (path) => {
      const found = children.find((child) => child.path === path)

      if (!found || OrdoFile.isOrdoFile(found)) return null

      return found
    },
    getFilesDeep: () => {
      const files = [] as IOrdoFile[]

      for (const item of children) {
        if (OrdoDirectory.isOrdoDirectory(item)) {
          files.push(...item.getFilesDeep())
        } else {
          files.push(item)
        }
      }

      return files
    },
    getDirectoriesDeep: () => {
      const directories = [] as IOrdoDirectory[]

      for (const item of children) {
        if (OrdoDirectory.isOrdoDirectory(item)) {
          directories.push(item)
          directories.push(...item.getDirectoriesDeep())
        }
      }

      return directories
    },
    toArray: () => {
      const items = [] as Array<IOrdoDirectory | IOrdoFile>

      for (const item of children) {
        if (OrdoDirectory.isOrdoDirectory(item)) {
          items.push(...item.toArray())
        }

        items.push(item)
      }

      return items
    },
  }
}

export const OrdoDirectory: IOrdoDirectoryStatic = {
  of: (raw) => ordoDirectory(raw),
  raw: ({ path, children, metadata }) => {
    if (!OrdoDirectory.isValidPath(path)) {
      throw new TypeError("Invalid directory path")
    }

    return { path, children, metadata: metadata ?? {} }
  },
  empty: (path) => OrdoDirectory.from({ path, children: [], metadata: {} }),
  from: (params) => OrdoDirectory.of(OrdoDirectory.raw(params)),
  isOrdoDirectoryRaw: (x): x is IOrdoDirectoryRaw =>
    Boolean(x) &&
    typeof (x as IOrdoDirectoryRaw).path === "string" &&
    OrdoDirectory.isValidPath((x as IOrdoDirectoryRaw).path) &&
    Array.isArray((x as IOrdoDirectoryRaw).children),
  isOrdoDirectory: (x): x is IOrdoDirectory =>
    Boolean(x) &&
    typeof (x as IOrdoDirectory).readableName === "string" &&
    Array.isArray((x as IOrdoDirectory).children) &&
    OrdoDirectory.isOrdoDirectoryRaw(x),
  isValidPath: (path): path is OrdoDirectoryPath =>
    typeof path === "string" && isValidPath(path) && endsWithSlash(path),
  sort: (children) => {
    children.sort((a, b) => {
      if (OrdoDirectory.isOrdoDirectory(a)) {
        OrdoDirectory.sort(a.children)
      }

      if (OrdoDirectory.isOrdoDirectory(b)) {
        OrdoDirectory.sort(b.children)
      }

      if (!OrdoDirectory.isOrdoDirectory(a) && OrdoDirectory.isOrdoDirectory(b)) {
        return 1
      }

      if (OrdoDirectory.isOrdoDirectory(a) && !OrdoDirectory.isOrdoDirectory(b)) {
        return -1
      }

      return a.readableName.localeCompare(b.readableName)
    })
  },
  getReadableName: (path) => {
    if (!OrdoDirectory.isValidPath(path)) {
      throw new TypeError("Invalid directory path")
    }

    const lastSeparatorPosition = path.slice(0, -1).lastIndexOf("/") + 1

    return path.slice(lastSeparatorPosition, -1)
  },
  getParentPath: (path) => {
    if (!OrdoDirectory.isValidPath(path)) {
      throw new TypeError("Invalid directory path")
    }

    const splittablePath = path.slice(0, -1)
    if (!splittablePath) return path
    const lastSeparatorPosition = splittablePath.lastIndexOf("/") + 1

    return splittablePath.slice(0, lastSeparatorPosition) as OrdoDirectoryPath
  },
  findParent: (path, root) => {
    if (!OrdoDirectory.isValidPath(path)) {
      throw new TypeError("Invalid directory path")
    }

    const parentPath = OrdoDirectory.getParentPath(path as OrdoDirectoryPath)

    const pathChunks = parentPath.split("/").filter(Boolean)

    let parent = root

    for (const chunk of pathChunks) {
      const found = parent.children.find(
        (child) => child.path === parent.path.concat(chunk).concat("/"),
      )

      if (!found || !OrdoDirectory.isOrdoDirectory(found)) return null

      parent = found
    }

    return parent
  },
  findDirectoryDeep: (path, root) => {
    if (!root) return null

    if (path === "/") return root

    const directChild = root.children.find((child) => child.path === path)

    if (directChild && OrdoDirectory.isOrdoDirectory(directChild)) return directChild

    const parent = OrdoDirectory.findParent(path, root)

    const found = parent?.children.find((child) => child.path === path)

    if (!found || OrdoFile.isOrdoFile(found)) return null

    return found
  },
  findFileDeep: (path, root) => {
    if (!root) return null

    const directChild = root.children.find((child) => child.path === path)

    if (directChild && OrdoFile.isOrdoFile(directChild)) return directChild

    const parent = OrdoFile.findParent(path, root)

    const found = parent?.children.find((child) => child.path === path)

    if (!found || OrdoDirectory.isOrdoDirectory(found)) return null

    return found
  },
}
