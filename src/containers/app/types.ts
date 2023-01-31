import {
  Nullable,
  OrdoActivityExtension,
  OrdoCommand,
  OrdoCommandExtension,
  OrdoDirectory,
  OrdoFileAssociationExtension,
  OrdoEditorPluginExtension,
  OrdoLoadableComponent,
} from "$core/types"

export type AppState = {
  isSidebarVisible: boolean
  personalProject: Nullable<OrdoDirectory>
  activityExtensions: OrdoActivityExtension<string>[]
  commandExtensions: OrdoCommandExtension<string>[]
  fileAssociationExtensions: OrdoFileAssociationExtension<string>[]
  editorPluginExtensions: OrdoEditorPluginExtension<string>[]
  commands: OrdoCommand<string>[]
  overlays: OrdoLoadableComponent[]
}

export type UpdatedFilePayload = {
  path: string
  content: string
}
