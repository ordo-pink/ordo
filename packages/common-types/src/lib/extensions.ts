import { Logger } from "@ordo-pink/logger"
import { ComponentType } from "react"
import { ExecuteCommandFn, RegisterCommandFn } from "./commands"
import { IOrdoFile, OrdoFileExtension } from "./fs/ordo-file"
import { Route } from "./routing"
import { RegisterTranslationsFn } from "./translations"
import { BinaryFn, UnaryFn } from "./types"

export type RegisterActivityFn = UnaryFn<string, BinaryFn<string, Omit<Activity, "name">, void>>

export type RegisterFileAssociationFn = UnaryFn<
  string,
  BinaryFn<string, Omit<FileAssociation, "name">, void>
>

export type UnregisterActivityFn = UnaryFn<string, UnaryFn<string, void>>

export type UnregisterFileAssociationFn = UnaryFn<string, UnaryFn<string, void>>

export type ExtensionCreatorScopedContext = {
  commands: {
    on: RegisterCommandFn
    off: RegisterCommandFn
    emit: ExecuteCommandFn
  }
  registerTranslations: ReturnType<RegisterTranslationsFn>
  registerActivity: ReturnType<RegisterActivityFn>
  unregisterActivity: ReturnType<UnregisterActivityFn>
  registerFileAssociation: ReturnType<RegisterFileAssociationFn>
  unregisterFileAssociation: ReturnType<UnregisterFileAssociationFn>
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
  Icon: ComponentType<{ file: IOrdoFile }>
}
