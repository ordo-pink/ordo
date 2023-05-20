import { UnaryFn } from "../../types"
import { OrdoDirectoryPath, IOrdoDirectory } from "../ordo-directory"

export type IOrdoDirectoryModel<Mode extends "sync" | "async" = "async"> = {
  exists: UnaryFn<OrdoDirectoryPath, Mode extends "async" ? Promise<boolean> : boolean>
  create: UnaryFn<
    { path: OrdoDirectoryPath; issuerId: string },
    Mode extends "async" ? Promise<IOrdoDirectory> : IOrdoDirectory
  >
  read: UnaryFn<
    { path: OrdoDirectoryPath; issuerId: string },
    Mode extends "async" ? Promise<IOrdoDirectory> : IOrdoDirectory
  >
  update: UnaryFn<
    { path: OrdoDirectoryPath; issuerId: string },
    Mode extends "async" ? Promise<IOrdoDirectory> : IOrdoDirectory
  >
  delete: UnaryFn<
    { path: OrdoDirectoryPath; issuerId: string },
    Mode extends "async" ? Promise<IOrdoDirectory> : IOrdoDirectory
  >
}
