import { IOrdoDirectory, IOrdoFile, Nullable } from "@ordo-pink/core"

import { OrdoCommand } from "$core/types"

export type ContextMenuActionParams<T = unknown> = {
  contextMenuTarget: Nullable<IOrdoFile | IOrdoDirectory | T>
}

export type ContextMenuTemplateItem<T extends string = string> = OrdoCommand<T>

export type ContextMenuTemplate = {
  children: ContextMenuTemplateItem[]
}

export type ContextMenuTarget<T = void> = T extends void
  ? Nullable<IOrdoFile | IOrdoDirectory>
  : Nullable<T>
