import { Transformer } from "@lexical/markdown"
import { Logger } from "@ordo-pink/logger"
import { LexicalNode } from "lexical"
import { ComponentType } from "react"
import { IconType } from "react-icons"
import { CommandListener, ExecuteCommandFn, RegisterCommandFn } from "./commands"
import { IOrdoFile, OrdoFileExtension } from "./fs/ordo-file"
import { Route } from "./routing"
import { RegisterTranslationsFn } from "./translations"
import { BinaryFn, ThunkFn, UnaryFn } from "./types"

export enum IconSize {
  EXTRA_SMALL = "xs",
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  EXTRA_LARGE = "xl",
  TILE = "2xl",
}

export type RegisterActivityFn = UnaryFn<string, BinaryFn<string, Omit<Activity, "name">, void>>
export type RegisterContextMenuItemFn = UnaryFn<
  string,
  BinaryFn<
    CommandListener,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shouldShow: (target: any) => boolean
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payloadCreator: (target: any) => any
      Icon: IconType
      accelerator?: string
      type: "create" | "read" | "update" | "delete"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      disabled?: (target: any) => boolean
    },
    void
  >
>
export type RegisterFileAssociationFn = UnaryFn<
  string,
  BinaryFn<string, Omit<FileAssociation, "name">, void>
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegisterCommandPaletteItemFn = UnaryFn<CommandPaletteItem, void>

export type RegisterEditorPluginFn = UnaryFn<
  string,
  BinaryFn<string, Omit<EditorPlugin, "name">, void>
>

export type UnregisterEditorPluginFn = UnaryFn<string, UnaryFn<string, void>>
export type UnregisterCommandPaletteItemFn = UnaryFn<string, void>
export type UnregisterActivityFn = UnaryFn<string, UnaryFn<string, void>>
export type UnregisterContextMenuItemFn = UnaryFn<string, UnaryFn<string, void>>
export type UnregisterFileAssociationFn = UnaryFn<string, UnaryFn<string, void>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandPaletteItem = {
  id: string
  name: string
  Icon?: IconType
  Comment?: ComponentType
  Footer?: ComponentType
  onSelect: ThunkFn<void>
}

export type ExtensionCreatorScopedContext = {
  commands: {
    before: ReturnType<RegisterCommandFn>
    after: ReturnType<RegisterCommandFn>
    on: ReturnType<RegisterCommandFn>
    off: ReturnType<RegisterCommandFn>
    emit: ExecuteCommandFn
  }
  registerEditorPlugin: ReturnType<RegisterEditorPluginFn>
  unregisterEditorPlugin: ReturnType<UnregisterEditorPluginFn>
  registerContextMenuItem: ReturnType<RegisterContextMenuItemFn>
  unregisterContextMenuItem: ReturnType<UnregisterContextMenuItemFn>
  registerTranslations: ReturnType<RegisterTranslationsFn>
  registerActivity: ReturnType<RegisterActivityFn>
  unregisterActivity: ReturnType<UnregisterActivityFn>
  registerFileAssociation: ReturnType<RegisterFileAssociationFn>
  unregisterFileAssociation: ReturnType<UnregisterFileAssociationFn>
  registerCommandPaletteItem: RegisterCommandPaletteItemFn
  unregisterCommandPaletteItem: UnregisterCommandPaletteItemFn
  translate: (key: string) => string
  logger: Logger
}

export type ExtensionCreatorContext = {
  commands: {
    before: ReturnType<RegisterCommandFn>
    after: ReturnType<RegisterCommandFn>
    on: RegisterCommandFn
    off: RegisterCommandFn
    emit: ExecuteCommandFn
  }
  registerEditorPlugin: RegisterEditorPluginFn
  unregisterEditorPlugin: UnregisterEditorPluginFn
  registerContextMenuItem: RegisterContextMenuItemFn
  unregisterContextMenuItem: UnregisterContextMenuItemFn
  registerActivity: RegisterActivityFn
  unregisterActivity: UnregisterActivityFn
  registerFileAssociation: RegisterFileAssociationFn
  unregisterFileAssociation: UnregisterFileAssociationFn
  registerTranslations: RegisterTranslationsFn
  registerCommandPaletteItem: RegisterCommandPaletteItemFn
  unregisterCommandPaletteItem: UnregisterCommandPaletteItemFn
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
  show?: boolean
}

export type FileAssociation = {
  name: string
  fileExtensions: OrdoFileExtension[] | "*"
  Component: ComponentType<{ file: IOrdoFile }>
  Icon: ComponentType<{ file: IOrdoFile; size: IconSize }>
}

export type EditorPlugin = {
  name: string
  Plugin?: ComponentType
  transformer?: Transformer
  nodes?: (typeof LexicalNode)[]
}
