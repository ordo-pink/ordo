import { Logger } from "@ordo-pink/logger"
import { ComponentType } from "react"
import { ExecuteCommandFn, RegisterCommandFn } from "./commands"
import { IOrdoFile, OrdoFileExtension } from "./fs/ordo-file"
import { Route } from "./routing"
import { RegisterTranslationsFn } from "./translations"
import { UnaryFn } from "./types"

export type RegisterActivityFn = UnaryFn<Activity, void>

export type RegisterFileAssociationFn = UnaryFn<FileAssociation, void>

export type UnregisterActivityFn = UnaryFn<Activity, void>

export type UnregisterFileAssociationFn = UnaryFn<FileAssociation, void>

export type ExtensionCreatorScopedContext = {
  commands: {
    on: RegisterCommandFn
    off: RegisterCommandFn
    emit: ExecuteCommandFn
  }
  registerTranslations: ReturnType<RegisterTranslationsFn>
  registerActivity: RegisterActivityFn
  unregisterActivity: UnregisterActivityFn
  registerFileAssociation: RegisterFileAssociationFn
  unregisterFileAssociation: UnregisterFileAssociationFn
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
  registerFileAssociation: RegisterFileAssociationFn
  unregisterFileAssociation: UnregisterFileAssociationFn
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
  name: string
  fileExtensions: OrdoFileExtension[] | "*"
  Component: ComponentType<{ file: IOrdoFile }>
  Icon: ComponentType | Record<OrdoFileExtension, ComponentType>
}
