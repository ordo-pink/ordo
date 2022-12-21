import { OrdoExtensionType } from "$core/constants/ordo-extension-type"
import {
  isActivityExtension,
  isCommandExtension,
  isFileAssociationExtension,
  isIsmParserExtension,
  isLocalSettingExtension,
} from "$core/guards/is-extension.guard"
import { OrdoActivityExtension, OrdoExtension } from "$core/types"
import { Switch } from "$core/utils/switch"

export const getActivityRoute = (activity: OrdoActivityExtension<string>) =>
  activity.paths?.[0] ? `/${activity.paths?.[0]}` : `/${getExtensionName(activity)}`

export const getExtensionReadableName = (extension: OrdoExtension<string, OrdoExtensionType>) => {
  const checkHasReadableName = (currentExtension: OrdoExtension<string, OrdoExtensionType>) =>
    Boolean(currentExtension.readableName)

  const readableNameFn = Switch.of(extension)
    .case(checkHasReadableName, () => extension.readableName as string)
    .default(getExtensionName)

  return readableNameFn(extension)
}

export const getExtensionName = (extension: OrdoExtension<string, OrdoExtensionType>) => {
  const extensionNameThunk = Switch.of(extension)
    .case(isActivityExtension, () => extension.name.replace("ordo-activity-", ""))
    .case(isFileAssociationExtension, () => extension.name.replace("ordo-file-association-", ""))
    .case(isCommandExtension, () => extension.name.replace("ordo-command-", ""))
    .case(isIsmParserExtension, () => extension.name.replace("ordo-ism-parser-", ""))
    .case(isLocalSettingExtension, () => extension.name.replace("ordo-local-setting-", ""))
    .default(() => "")

  return extensionNameThunk()
}
