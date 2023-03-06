import { Nullable } from "@ordo-pink/common-types"
import {
  OrdoActivityExtension,
  OrdoCommandExtension,
  OrdoFileAssociationExtension,
  OrdoEditorPluginExtension,
  OrdoCommand,
} from "@ordo-pink/extensions"
import { IOrdoDirectory, IOrdoFile } from "@ordo-pink/fs-entity"
import { FC } from "react"

export type AppState = {
  isSidebarVisible: boolean
  personalProject: Nullable<IOrdoDirectory>
  activityExtensions: OrdoActivityExtension<
    string,
    Record<string, unknown>,
    Record<string, unknown>
  >[]
  commandExtensions: OrdoCommandExtension<
    string,
    Record<string, unknown>,
    Record<string, unknown>
  >[]
  fileAssociationExtensions: OrdoFileAssociationExtension<
    string,
    Record<string, unknown>,
    Record<string, unknown>
  >[]
  editorPluginExtensions: OrdoEditorPluginExtension<
    string,
    Record<string, unknown>,
    Record<string, unknown>
  >[]
  commands: OrdoCommand<string>[]
  overlays: FC[]
  isSaving: boolean
}

export type UpdateFilePayload = {
  file: IOrdoFile
  content: string
}

export type CreateFilePayload = {
  file: IOrdoFile
  content?: string
}
