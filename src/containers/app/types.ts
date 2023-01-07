import {
  Nullable,
  OrdoActivityExtension,
  OrdoCommand,
  OrdoCommandExtension,
  OrdoDirectory,
  OrdoFileAssociationExtension,
  OrdoIsmParserExtension,
} from "$core/types"

export type AppState = {
  personalProject: Nullable<OrdoDirectory>
  activityExtensions: OrdoActivityExtension<string>[]
  commandExtensions: OrdoCommandExtension<string>[]
  fileAssociationExtensions: OrdoFileAssociationExtension<string>[]
  ismParserExtensions: OrdoIsmParserExtension<string>[]
  commands: OrdoCommand<string>[]
}

export type UpdatedFilePayload = {
  path: string
  content: string
}
