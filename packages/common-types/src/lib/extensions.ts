import { ComponentType } from "react"
import { ExecuteCommandFn, RegisterCommandFn } from "./commands"
import { OrdoFileExtension } from "./fs/ordo-file"
import { Route } from "./routing"
import { RegisterTranslationsFn } from "./translations"

export type ExtensionCreatorScopedContext = {
  executeCommand: ExecuteCommandFn
  registerCommand: RegisterCommandFn
  registerTranslations: ReturnType<RegisterTranslationsFn>
  translate: (key: string) => string
}

export type ExtensionCreatorContext = {
  executeCommand: ExecuteCommandFn
  registerCommand: RegisterCommandFn
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

export type ExtensionModule = {
  activities?: Activity[]
  fileAssociations?: FileAssociation[]
}
