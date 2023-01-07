import { Nullable, OrdoCommand, OrdoDirectory, OrdoFile } from "$core/types"

export type ContextMenuActionParams<T = unknown> = {
  contextMenuTarget: Nullable<OrdoFile | OrdoDirectory | T>
}

export type ContextMenuTemplateItem<T extends string = string> = OrdoCommand<T>

export type ContextMenuTemplate = {
  children: ContextMenuTemplateItem[]
}

export type ContextMenuTarget<T = void> = T extends void
  ? Nullable<OrdoFile | OrdoDirectory>
  : Nullable<T>
