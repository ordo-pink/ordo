import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { AppState } from "$containers/app/types"
import { OrdoExtensionType } from "$core/constants/ordo-extension-type"
import {
  isActivityExtension,
  isCommandExtension,
  isFileAssociationExtension,
  isIsmParserExtension,
  isLocalSettingExtension,
} from "$core/guards/is-extension.guard"
import { OrdoDirectory, OrdoExtension, OrdoFile } from "$core/types"
import { findParent } from "$core/utils/fs-helpers"

const initialState: AppState = {
  isLoading: false,
  localSettings: {},
  projectSettings: {},
  userSettings: {},
  personalProject: null,
  activityExtensions: [],
  commandExtensions: [],
  fileAssociationExtensions: [],
  ismParserExtensions: [],
  localSettingExtensions: [],
}

export const appSlice = createSlice({
  name: "@ordo-app",
  initialState,
  reducers: {
    createdFile: (state, action: PayloadAction<OrdoFile>) => {
      const parent = findParent(action.payload, state.personalProject)

      if (!parent) throw new Error("@app/create-file.parent-not-found")

      parent.children.push(action.payload)
    },
    createdDirectory: (state, action: PayloadAction<OrdoDirectory>) => {
      const parent = findParent(action.payload, state.personalProject)

      if (!parent) throw new Error("@app/create-directory.parent-not-found")

      parent.children.push(action.payload)
    },
    gotDirectory: (state, action: PayloadAction<OrdoDirectory>) => {
      if (action.payload.path === "/") {
        state.personalProject = action.payload
        return
      }

      // TODO: Handle cases when we got a non-root directory

      // const parent = findParent(action.payload, state.personalProject)
      // if (!parent) throw new Error("@app/get-directory.parent-not-found")
      // parent.children.push(action.payload)
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    registerExtensions: (
      state,
      action: PayloadAction<OrdoExtension<string, OrdoExtensionType>[]>,
    ) => {
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
          isIsmParserExtension(extension) &&
          !state.ismParserExtensions.some((ext) => ext.name === extension.name)
        )
          state.ismParserExtensions.push(extension)
        else if (
          isLocalSettingExtension(extension) &&
          !state.localSettingExtensions.some((ext) => ext.name === extension.name)
        )
          state.localSettingExtensions.push(extension)
      })
    },
  },
})

export const { setIsLoading, registerExtensions, gotDirectory, createdDirectory, createdFile } =
  appSlice.actions

export default appSlice.reducer
