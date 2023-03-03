import { UnaryFn } from "@ordo-pink/common-types"
import { IOrdoDirectory } from "@ordo-pink/fs-entity"
import { KeycloakTokenParsed } from "keycloak-js"
import { executeCommand, registerCommand } from "./commands"
import { navigate, openExternal } from "./router"
import { registerTranslations } from "./translations"

export type Extension = {
  activities: Activity[]
}

export type ExtensionModule = {
  init: () => Extension
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

export type RenderIconContext = RenderActivityContext
export type RenderSidebarContext = RenderActivityContext

export type Activity = {
  routes: string[]
  name: string
  render: UnaryFn<RenderActivityContext, void>
  renderIcon: UnaryFn<RenderIconContext, void>
  renderSidebar?: UnaryFn<RenderSidebarContext, void>
}

export type RenderFileAssociationContext<
  Params extends Record<string, string> = Record<string, string>,
  Data = null,
> = {
  container: HTMLDivElement
  routeData: Route<Params, Data>
}

export type ExtensionCreatorScopedContext = {
  executeCommand: typeof executeCommand
  registerCommand: typeof registerCommand
  navigate: typeof navigate
  openExternal: typeof openExternal
  registerTranslations: ReturnType<typeof registerTranslations>
  translate: (key: string) => string
}

export type ExtensionCreatorContext = {
  executeCommand: typeof executeCommand
  registerCommand: typeof registerCommand
  navigate: typeof navigate
  openExternal: typeof openExternal
  registerTranslations: typeof registerTranslations
}

export type UserAuth = { token: string; tokenParsed: KeycloakTokenParsed }

export type UserStorage = {
  totalSize: number
  maxUploadSize: number
  maxTotalSize: number
}

export type OrdoExtensionProducer = (ctx: ExtensionCreatorContext) => ExtensionModule

export type UserExtensions = string[]

export type AuthenticatedUser = {
  auth: UserAuth
  extensions: UserExtensions
  storage: UserStorage
  tree: IOrdoDirectory
  // permissions: UserPermissions
  // settings: UserSettings
  // shares: UserShares
}
