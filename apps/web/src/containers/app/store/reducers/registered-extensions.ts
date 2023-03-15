import {
  OrdoExtension,
  OrdoExtensionType,
  isActivityExtension,
  isCommandExtension,
  isFileAssociationExtension,
  isEditorPluginExtension,
} from "@ordo-pink/extensions"
import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from "../../types"

export const registeredExtensionsReducer: CaseReducer<
  AppState,
  PayloadAction<
    OrdoExtension<string, OrdoExtensionType, Record<string, unknown>, Record<string, unknown>>[]
  >
> = (state, action) => {
  state.activityExtensions = []
  state.commandExtensions = []
  state.editorPluginExtensions = []
  state.fileAssociationExtensions = []
  state.commands = []
  state.overlays = []
  state.editor = {
    plugins: [],
    nodes: [],
    transformers: [],
  }

  action.payload.forEach((extension) => {
    if (
      isActivityExtension(extension) &&
      !state.activityExtensions.some((ext) => ext.name === extension.name)
    )
      state.activityExtensions.push(
        extension as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      )
    else if (
      isCommandExtension(extension) &&
      !state.commandExtensions.some((ext) => ext.name === extension.name)
    )
      state.commandExtensions.push(
        extension as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      )
    else if (
      isFileAssociationExtension(extension) &&
      !state.fileAssociationExtensions.some((ext) => ext.name === extension.name)
    )
      state.fileAssociationExtensions.push(
        extension as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      )
    else if (
      isEditorPluginExtension(extension) &&
      !state.editorPluginExtensions.some((ext) => ext.name === extension.name)
    )
      state.editorPluginExtensions.push(
        extension as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      )
    else return

    if (extension.nodes) {
      state.editor.nodes = state.editor.nodes.concat(extension.nodes)
    }

    if (extension.transformers) {
      state.editor.transformers = state.editor.transformers.concat(extension.transformers as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    if (extension.editorPlugins) {
      state.editor.plugins = state.editor.plugins.concat(extension.editorPlugins as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    if (extension.commands) {
      state.commands = state.commands.concat(extension.commands)
    }

    if (extension.overlayComponents) {
      state.overlays.push(...(extension.overlayComponents as any)) // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  })
}
