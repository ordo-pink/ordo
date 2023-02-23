import { OrdoFilePath, IOrdoDirectory, Nullable } from "@ordo-pink/core"
import {
  OrdoActivityExtension,
  OrdoCommand,
  OrdoCommandExtension,
  OrdoFileAssociationExtension,
  OrdoEditorPluginExtension,
  OrdoLoadableComponent,
} from "$core/types"

export type AppState = {
  isSidebarVisible: boolean
  personalProject: Nullable<IOrdoDirectory>
  activityExtensions: OrdoActivityExtension<string>[]
  commandExtensions: OrdoCommandExtension<string>[]
  fileAssociationExtensions: OrdoFileAssociationExtension<string>[]
  editorPluginExtensions: OrdoEditorPluginExtension<string>[]
  commands: OrdoCommand<string>[]
  overlays: OrdoLoadableComponent[]
  isSaving: boolean
}

export type UpdateFilePayload = {
  path: OrdoFilePath
  content: string
}

export type CreateFilePayload = {
  path: OrdoFilePath
  content?: string
}
