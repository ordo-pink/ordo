import { OrdoExtensionType } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import {
  isActivityExtension,
  isFileAssociationExtension,
  isCommandExtension,
  isEditorPluginExtension,
} from "../guards/is-extension"
import { OrdoActivityExtension, OrdoExtension } from "../types"

export const getActivityRoute = (activity: OrdoActivityExtension<string>) =>
  activity.routes?.[0] ? `/${activity.routes?.[0]}` : `/${getExtensionName(activity)}`

export const getExtensionReadableName = (extension: OrdoExtension<string, OrdoExtensionType>) => {
  const checkHasReadableName = (currentExtension: OrdoExtension<string, OrdoExtensionType>) =>
    Boolean(currentExtension.readableName)

  return Switch.of(extension)
    .case(checkHasReadableName, () => extension.readableName as string)
    .default(() => getExtensionName(extension))
}

export const getExtensionName = (extension: OrdoExtension<string, OrdoExtensionType>) =>
  Switch.of(extension)
    .case(isActivityExtension, () => extension.name.replace("ordo-activity-", ""))
    .case(isFileAssociationExtension, () => extension.name.replace("ordo-file-association-", ""))
    .case(isCommandExtension, () => extension.name.replace("ordo-command-", ""))
    .case(isEditorPluginExtension, () => extension.name.replace("ordo-editor-plugin-", ""))
    .default(() => "")
