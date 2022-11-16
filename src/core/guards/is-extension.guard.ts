import { OrdoExtensionType } from "$core/constants/ordo-extension-type"
import {
  OrdoActivityExtension,
  OrdoCommandExtension,
  OrdoExtension,
  OrdoFileAssociationExtension,
  OrdoIsmParserExtension,
  OrdoLocalSettingExtension,
} from "$core/types"

const isExtensionType = (
  extensionType: OrdoExtensionType,
  extension: OrdoExtension<string, OrdoExtensionType>,
) => {
  const type = extension.name.split("-")[1]

  return Boolean(type) && type === extensionType
}

export const isActivityExtension = (
  extension: OrdoExtension<string, OrdoExtensionType>,
): extension is OrdoActivityExtension<string> =>
  isExtensionType(OrdoExtensionType.ACTIVITY, extension)

export const isCommandExtension = (
  extension: OrdoExtension<string, OrdoExtensionType>,
): extension is OrdoCommandExtension<string> =>
  isExtensionType(OrdoExtensionType.COMMAND, extension)

export const isFileAssociationExtension = (
  extension: OrdoExtension<string, OrdoExtensionType>,
): extension is OrdoFileAssociationExtension<string> =>
  isExtensionType(OrdoExtensionType.FILE_ASSOCIATION, extension)

export const isIsmParserExtension = (
  extension: OrdoExtension<string, OrdoExtensionType>,
): extension is OrdoIsmParserExtension<string> =>
  isExtensionType(OrdoExtensionType.ISM_PARSER, extension)

export const isLocalSettingExtension = (
  extension: OrdoExtension<string, OrdoExtensionType>,
): extension is OrdoLocalSettingExtension<string> =>
  isExtensionType(OrdoExtensionType.LOCAL_SETTING, extension)
