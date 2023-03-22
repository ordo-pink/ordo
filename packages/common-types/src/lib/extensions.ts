import { ComponentType } from "react"
import { ExecuteCommandFn, ListenCommandFn, RegisterCommandFn } from "./commands"
import { OrdoFileExtension } from "./fs/ordo-file"
import { Route } from "./routing"
import { RegisterTranslationsFn } from "./translations"
import { UnaryFn } from "./types"

export type RegisterActivityFn = UnaryFn<Activity, void>

export type UnregisterActivityFn = UnaryFn<Activity, void>

export type ExtensionCreatorScopedContext = {
  executeCommand: ExecuteCommandFn
  registerCommand: RegisterCommandFn
  registerTranslations: ReturnType<RegisterTranslationsFn>
  listenCommand: ListenCommandFn
  registerActivity: RegisterActivityFn
  unregisterActivity: UnregisterActivityFn
  translate: (key: string) => string
}

export type ExtensionCreatorContext = {
  executeCommand: ExecuteCommandFn
  registerCommand: RegisterCommandFn
  listenCommand: ListenCommandFn
  registerActivity: RegisterActivityFn
  unregisterActivity: UnregisterActivityFn
  registerTranslations: RegisterTranslationsFn
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
  name: string
  routes: string[]
  Component: ComponentType
  Icon: ComponentType
  Sidebar?: ComponentType
}

export type FileAssociation = {
  fileExtensions: OrdoFileExtension[] | "*"
  Component: ComponentType
  Icon: ComponentType | Record<OrdoFileExtension, ComponentType>
}
