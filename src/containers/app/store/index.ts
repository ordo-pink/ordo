import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { createdReducer } from "$containers/app/store/reducers/created"
import { gotDirectoryReducer } from "$containers/app/store/reducers/got-directory"
import { registeredExtensionsReducer } from "$containers/app/store/reducers/registered-extensions"
import { rejectedReducer } from "$containers/app/store/reducers/rejected"
import { removedReducer } from "$containers/app/store/reducers/removed"
import { AppState, UpdatedFilePayload } from "$containers/app/types"

const initialState: AppState = {
  personalProject: null,
  isSidebarVisible: Boolean(window) && window.innerWidth > 448,
  activityExtensions: [],
  commandExtensions: [],
  fileAssociationExtensions: [],
  editorPluginExtensions: [],
  commands: [],
  overlays: [],
}

export const createdFile = createAsyncThunk("@ordo-app/create-file", (path: string) =>
  window.ordo.api.fs.files.create(path),
)

export const createdDirectory = createAsyncThunk("@ordo-app/create-directory", (path: string) =>
  window.ordo.api.fs.directories.create(path),
)

export const gotDirectory = createAsyncThunk("@ordo-app/get-directory", (path: string) =>
  window.ordo.api.fs.directories.get(path),
)

export const removedFile = createAsyncThunk("@ordo-app/remove-file", (path: string) =>
  window.ordo.api.fs.files.remove(path),
)

export const removedDirectory = createAsyncThunk("@ordo-app/remove-directory", (path: string) =>
  window.ordo.api.fs.directories.remove(path),
)

export const updatedFile = createAsyncThunk(
  "@ordo-app/update-file",
  ({ path, content }: UpdatedFilePayload) => window.ordo.api.fs.files.update(path, content),
)

export const appSlice = createSlice({
  name: "@ordo-app",
  initialState,
  reducers: {
    registeredExtensions: registeredExtensionsReducer,
    toggleSidebarVisibility: (state) => {
      state.isSidebarVisible = !state.isSidebarVisible
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createdFile.fulfilled, createdReducer)
      .addCase(createdFile.rejected, rejectedReducer)

      .addCase(createdDirectory.fulfilled, createdReducer)
      .addCase(createdDirectory.rejected, rejectedReducer)

      .addCase(gotDirectory.fulfilled, gotDirectoryReducer)
      .addCase(gotDirectory.rejected, rejectedReducer)

      .addCase(removedFile.fulfilled, removedReducer)
      .addCase(removedFile.rejected, rejectedReducer)

      .addCase(removedDirectory.fulfilled, removedReducer)
      .addCase(removedDirectory.rejected, rejectedReducer)
  },
})

export const { registeredExtensions, toggleSidebarVisibility } = appSlice.actions

export default appSlice.reducer
