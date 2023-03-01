import { IOrdoDirectory } from "@ordo-pink/fs-entity"
import { executeCommand, registerCommand } from "./main"

export type Extension = {
  routes: string[]
}

export type ExtensionModule = {
  init: () => Extension
  renderFileAssociation?: (ctx: RenderFileAssociationContext) => void
  renderActivity?: (ctx: RenderActivityContext) => void
  deinit?: () => void
}

export type Route<Params extends Record<string, string> = Record<string, string>, Data = null> = {
  params: Params
  data: Data
  hash: string
  hashRouting: boolean
  search: string
  path: string
  route: string
}

export type RenderActivityContext<
  Params extends Record<string, string> = Record<string, string>,
  Data = null,
> = {
  container: HTMLDivElement
  routeData: Route<Params, Data>
}

export type RenderFileAssociationContext<
  Params extends Record<string, string> = Record<string, string>,
  Data = null,
> = {
  container: HTMLDivElement
  routeData: Route<Params, Data>
}

export type ExtensionCreatorContext = {
  executeCommand: typeof executeCommand
  registerCommand: typeof registerCommand
}

export type UserAuth = { isAuthenticated: true; email: string; username: string; sub: string }

export type UserStorage = {
  totalSize: number
  maxUploadSize: number
  maxTotalSize: number
  tree: IOrdoDirectory
}

export type OrdoExtensionProducer = (ctx: ExtensionCreatorContext) => ExtensionModule

export type UserExtensions = string[]

export type AuthenticatedUser = {
  auth: UserAuth
  extensions: UserExtensions
  storage: UserStorage
  // permissions: UserPermissions
  // settings: UserSettings
  // shares: UserShares
}

// type NonAuthenticatedUser = {
//   auth: { isAuthenticated: false }
//   extensions: UserExtensions
// }

// type FSPermissions = {
//   read: string
//   write: string
//   share: boolean
//   remove: boolean
//   rename: boolean
// }

// type UserPermissions = { http: Record<string, string[]>; fs: Record<string, FSPermissions> }

// type UserSettings = Record<string, Record<string, unknown>>

// type UserShares = Record<string, Record<string, FSPermissions>>

// type User = NonAuthenticatedUser | AuthenticatedUser
