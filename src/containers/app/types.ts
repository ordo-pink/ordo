import {
  Nullable,
  OrdoActivityExtension,
  OrdoCommandExtension,
  OrdoDirectory,
  OrdoFileAssociationExtension,
  OrdoIsmParserExtension,
  OrdoLocalSettingExtension,
} from "$core/types"

export type AppState = {
  localSettings: object
  projectSettings: object
  userSettings: object
  personalProject: Nullable<OrdoDirectory>
  activityExtensions: OrdoActivityExtension<string>[]
  commandExtensions: OrdoCommandExtension<string>[]
  fileAssociationExtensions: OrdoFileAssociationExtension<string>[]
  ismParserExtensions: OrdoIsmParserExtension<string>[]
  localSettingExtensions: OrdoLocalSettingExtension<string>[]
}

export type UpdatedFilePayload = {
  path: string
  content: string
}
