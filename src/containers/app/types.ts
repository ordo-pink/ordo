import {
  OrdoActivityExtension,
  OrdoCommandExtension,
  OrdoFileAssociationExtension,
  OrdoIsmParserExtension,
  OrdoLocalSettingExtension,
} from "$core/types"

export type AppState = {
  isLoading: boolean
  localSettings: object
  projectSettings: object
  userSettings: object
  activityExtensions: OrdoActivityExtension<string>[]
  commandExtensions: OrdoCommandExtension<string>[]
  fileAssociationExtensions: OrdoFileAssociationExtension<string>[]
  ismParserExtensions: OrdoIsmParserExtension<string>[]
  localSettingExtensions: OrdoLocalSettingExtension<string>[]
}
