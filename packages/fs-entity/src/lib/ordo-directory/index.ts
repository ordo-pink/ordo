import {
  IOrdoDirectoryStatic,
  IOrdoDirectoryRaw,
  IOrdoDirectory,
  OrdoDirectoryPath,
  OrdoFsEntity,
} from "./types"
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
  }
}

export const OrdoDirectory: IOrdoDirectoryStatic = {
  of: (raw) => ordoDirectory(raw),
  raw: ({ path, children }) => {
    if (!OrdoDirectory.isValidPath(path)) {
      throw new TypeError("Invalid directory path")
    }

    return { path, children }
  },
  empty: (path) => OrdoDirectory.from({ path, children: [] }),
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
}
