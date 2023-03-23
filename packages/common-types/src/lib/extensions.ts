import { Logger } from "@ordo-pink/logger"
import { ComponentType } from "react"
import { ExecuteCommandFn, RegisterCommandFn } from "./commands"
import { OrdoFileExtension } from "./fs/ordo-file"
import { Route } from "./routing"
import { RegisterTranslationsFn } from "./translations"
import { UnaryFn } from "./types"

export type RegisterActivityFn = UnaryFn<Activity, void>

export type UnregisterActivityFn = UnaryFn<Activity, void>

export type ExtensionCreatorScopedContext = {
  commands: {
    on: RegisterCommandFn
    off: RegisterCommandFn
    emit: ExecuteCommandFn
  }
  registerTranslations: ReturnType<RegisterTranslationsFn>
  registerActivity: RegisterActivityFn
  unregisterActivity: UnregisterActivityFn
  translate: (key: string) => string
  logger: Logger
}

export type ExtensionCreatorContext = {
  commands: {
    on: RegisterCommandFn
    off: RegisterCommandFn
    emit: ExecuteCommandFn
  }
  registerActivity: RegisterActivityFn
  unregisterActivity: UnregisterActivityFn
  registerTranslations: RegisterTranslationsFn
  logger: Logger
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
