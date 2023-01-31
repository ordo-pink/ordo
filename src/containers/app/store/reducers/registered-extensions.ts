import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"

import { AppState } from "$containers/app/types"
import { OrdoExtensionType } from "$core/constants/ordo-extension-type"
import {
  isActivityExtension,
  isCommandExtension,
  isFileAssociationExtension,
  isEditorPluginExtension,
} from "$core/guards/is-extension"
import { OrdoExtension } from "$core/types"

export const registeredExtensionsReducer: CaseReducer<
  AppState,
  PayloadAction<OrdoExtension<string, OrdoExtensionType>[]>
> = (state, action) => {
  action.payload.forEach((extension) => {
    if (
      isActivityExtension(extension) &&
      !state.activityExtensions.some((ext) => ext.name === extension.name)
    )
      state.activityExtensions.push(extension)
    else if (
      isCommandExtension(extension) &&
      !state.commandExtensions.some((ext) => ext.name === extension.name)
    )
      state.commandExtensions.push(extension)
    else if (
      isFileAssociationExtension(extension) &&
      !state.fileAssociationExtensions.some((ext) => ext.name === extension.name)
    )
      state.fileAssociationExtensions.push(extension)
    else if (
      isEditorPluginExtension(extension) &&
      !state.editorPluginExtensions.some((ext) => ext.name === extension.name)
    )
      state.editorPluginExtensions.push(
        extension as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      )
    else return

    if (extension.commands) {
      state.commands = state.commands.concat(extension.commands)
    }

    if (extension.overlayComponents) {
      state.overlays.push(...extension.overlayComponents)
    }
  })
}
