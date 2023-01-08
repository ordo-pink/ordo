import {
  Nullable,
  OrdoActivityExtension,
  OrdoCommand,
  OrdoCommandExtension,
  OrdoDirectory,
  OrdoFileAssociationExtension,
  OrdoIsmParserExtension,
  OrdoLoadableComponent,
} from "$core/types"

export type AppState = {
  personalProject: Nullable<OrdoDirectory>
  activityExtensions: OrdoActivityExtension<string>[]
  commandExtensions: OrdoCommandExtension<string>[]
  fileAssociationExtensions: OrdoFileAssociationExtension<string>[]
  ismParserExtensions: OrdoIsmParserExtension<string>[]
  commands: OrdoCommand<string>[]
  overlays: OrdoLoadableComponent[]
}

export type UpdatedFilePayload = {
  path: string
  content: string
}
