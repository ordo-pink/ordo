import { Switch } from "@ordo-pink/switch"
import {
  isActivityExtension,
  isFileAssociationExtension,
  isCommandExtension,
  isEditorPluginExtension,
} from "./is-ordo-extension"
import { OrdoExtensionType } from "./ordo-extension-type"
import { OrdoActivityExtension, OrdoExtension } from "./types"

export const getActivityRoute = (
  activity: OrdoActivityExtension<string, Record<string, unknown>, Record<string, unknown>>,
) => (activity.routes?.[0] ? `/${activity.routes?.[0]}` : `/${getExtensionName(activity)}`)

export const getExtensionReadableName = (
  extension: OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
) => {
  const checkHasReadableName = (
    currentExtension: OrdoExtension<
      string,
      OrdoExtensionType,
      Record<string, unknown>,
      Record<string, unknown>
    >,
  ) => Boolean(currentExtension.readableName)

  return Switch.of(extension)
    .case(checkHasReadableName, () => extension.readableName as string)
    .default(() => getExtensionName(extension))
}

export const getExtensionName = (
  extension: OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
) =>
  Switch.of(extension)
    .case(isActivityExtension, () => extension.name.replace("ordo-activity-", ""))
    .case(isFileAssociationExtension, () => extension.name.replace("ordo-file-association-", ""))
    .case(isCommandExtension, () => extension.name.replace("ordo-command-", ""))
    .case(isEditorPluginExtension, () => extension.name.replace("ordo-editor-plugin-", ""))
    .default(() => "")
