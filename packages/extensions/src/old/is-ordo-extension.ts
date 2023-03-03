import { OrdoExtensionType } from "./ordo-extension-type"
import {
  OrdoExtension,
  OrdoActivityExtension,
  OrdoCommandExtension,
  OrdoFileAssociationExtension,
  OrdoEditorPluginExtension,
} from "./types"

const isExtensionType = (
  extensionType: OrdoExtensionType,
  extension: OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
) => {
  return extension.name.startsWith(`ordo-${extensionType}`)
}

export const isActivityExtension = (
  extension: OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
): extension is OrdoActivityExtension<string, Record<string, unknown>, Record<string, unknown>> =>
  isExtensionType(OrdoExtensionType.ACTIVITY, extension)

export const isCommandExtension = (
  extension: OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
): extension is OrdoCommandExtension<string, Record<string, unknown>, Record<string, unknown>> =>
  isExtensionType(OrdoExtensionType.COMMAND, extension)

export const isFileAssociationExtension = (
  extension: OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
): extension is OrdoFileAssociationExtension<
  string,
  Record<string, unknown>,
  Record<string, unknown>
> => isExtensionType(OrdoExtensionType.FILE_ASSOCIATION, extension)

export const isEditorPluginExtension = (
  extension: OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
): extension is OrdoEditorPluginExtension<
  string,
  Record<string, unknown>,
  Record<string, unknown>
> => isExtensionType(OrdoExtensionType.EDITOR_PLUGIN, extension)
