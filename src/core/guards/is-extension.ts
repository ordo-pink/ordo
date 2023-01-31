import { OrdoExtensionType } from "$core/constants/ordo-extension-type"
import {
  OrdoActivityExtension,
  OrdoCommandExtension,
  OrdoExtension,
  OrdoFileAssociationExtension,
  OrdoEditorPluginExtension,
} from "$core/types"

const isExtensionType = (
  extensionType: OrdoExtensionType,
  extension: OrdoExtension<string, OrdoExtensionType>,
) => {
  return extension.name.startsWith(`ordo-${extensionType}`)
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

export const isEditorPluginExtension = (
  extension: OrdoExtension<string, OrdoExtensionType>,
): extension is OrdoEditorPluginExtension<string> =>
  isExtensionType(OrdoExtensionType.EDITOR_PLUGIN, extension)
