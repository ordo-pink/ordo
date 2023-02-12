import { UnaryFn } from "../../types"
import { endsWithSlash, isValidPath } from "../common"
import { IOrdoFile, IOrdoFileRaw, OrdoFile } from "../ordo-file"

export type OrdoFsEntityRaw = IOrdoFileRaw | IOrdoDirectoryRaw

export type OrdoFsEntity = IOrdoFile | IOrdoDirectory

export type OrdoDirectoryPath = `/${string}/` | "/"

export interface IOrdoDirectoryRawInitParams {
  path: string
  children?: OrdoFsEntityRaw[]
}

export interface IOrdoDirectoryRaw {
  get path(): OrdoDirectoryPath
  get children(): OrdoFsEntityRaw[]
}

export type IOrdoDirectory = {
  get readableName(): string
  get path(): OrdoDirectoryPath
  get children(): OrdoFsEntity[]
}

export interface IOrdoDirectoryStatic {
  of: UnaryFn<IOrdoDirectoryRaw, IOrdoDirectory>
  from: UnaryFn<IOrdoDirectoryRawInitParams, IOrdoDirectory>
  raw: UnaryFn<IOrdoDirectoryRawInitParams, IOrdoDirectoryRaw>
  isValidPath: UnaryFn<string, boolean>
  sort: UnaryFn<IOrdoDirectory["children"], void>
  isOrdoDirectory: (x: unknown) => x is IOrdoDirectory
  isOrdoDirectoryRaw: (x: unknown) => x is IOrdoDirectoryRaw
  getReadableName: UnaryFn<OrdoDirectoryPath, string>
  getParentPath: UnaryFn<OrdoDirectoryPath, OrdoDirectoryPath>
  toDirectoryPath: UnaryFn<string, OrdoDirectoryPath>
}

export const OrdoDirectory: IOrdoDirectoryStatic = {
  of: (raw) => ordoDirectory(raw),
  raw: (params) => {
    const path = OrdoDirectory.toDirectoryPath(params.path)
    const children = params.children ?? []

    return {
      get path() {
        return path
      },
      get children() {
        return children
      },
    }
  },
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
  isValidPath: (path) => isValidPath(path) && endsWithSlash(path),
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
    const lastSeparatorPosition = path.slice(0, -1).lastIndexOf("/") + 1

    return path.slice(lastSeparatorPosition, -1)
  },
  getParentPath: (path) => {
    const splittablePath = path.slice(0, -1)
    if (!splittablePath) return path
    const lastSeparatorPosition = splittablePath.lastIndexOf("/") + 1

    return splittablePath.slice(0, lastSeparatorPosition) as OrdoDirectoryPath
  },
  toDirectoryPath: (path) => {
    if (!path || path === "/") return "/"

    if (!path.startsWith("/")) path = `/${path}`

    if (!path.endsWith("/")) path = `${path}/`

    return path as OrdoDirectoryPath
  },
}

export const ordoDirectory = (raw: IOrdoDirectoryRaw): IOrdoDirectory => {
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
    get readableName() {
      return readableName
    },
    get children() {
      return children
    },
    get path() {
      return raw.path
    },
  }
}
