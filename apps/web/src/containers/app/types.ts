import { Nullable } from "@ordo-pink/common-types"
import { IOrdoDirectory, IOrdoFile } from "@ordo-pink/fs-entity"
import {
  OrdoActivityExtension,
  OrdoCommandExtension,
  OrdoFileAssociationExtension,
  OrdoEditorPluginExtension,
  OrdoCommand,
  OrdoLoadableComponent,
} from "../../core/types"

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
  file: IOrdoFile
  content: string
}

export type CreateFilePayload = {
  file: IOrdoFile
  content?: string
}
