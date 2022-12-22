import { FC } from "react"

import { Icon, Nullable, OrdoDirectory, OrdoFile } from "$core/types"

export type ContextMenuActionParams<T = unknown> = {
  contextMenuTarget: Nullable<OrdoFile | OrdoDirectory | T>
}

export type ContextMenuTemplateItem = {
  accelerator?: string
  title: string
  Icon: Icon | FC
  action: (actionParams: ContextMenuActionParams) => void | Promise<void>
}

export type ContextMenuTemplate = {
  children: ContextMenuTemplateItem[]
}

export type ContextMenuTarget<T = unknown> = Nullable<OrdoFile | OrdoDirectory | T>
