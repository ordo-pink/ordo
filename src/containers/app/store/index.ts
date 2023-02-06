import {
  createSlice,
  createAsyncThunk,
  AsyncThunkPayloadCreator,
  PayloadAction,
} from "@reduxjs/toolkit"
import { debounce } from "lodash"

import { createdReducer } from "$containers/app/store/reducers/created"
import { gotDirectoryReducer } from "$containers/app/store/reducers/got-directory"
import { registeredExtensionsReducer } from "$containers/app/store/reducers/registered-extensions"
import { rejectedReducer } from "$containers/app/store/reducers/rejected"
import { removedReducer } from "$containers/app/store/reducers/removed"
import { updatedFileReducer } from "$containers/app/store/reducers/updated-file"
import { AppState, UpdatedFilePayload } from "$containers/app/types"
import { OrdoFile } from "$core/types"

const initialState: AppState = {
  personalProject: null,
  isSidebarVisible: Boolean(window) && window.innerWidth > 448,
  activityExtensions: [],
  commandExtensions: [],
  fileAssociationExtensions: [],
  editorPluginExtensions: [],
  commands: [],
  overlays: [],
  isSaving: false,
}

const updateFileHandler: AsyncThunkPayloadCreator<OrdoFile, UpdatedFilePayload> = async (
  { path, content },
  { dispatch },
) => {
  const result = await window.ordo.api.fs.files.update(path, content)

  dispatch(setIsSaving(false))

  return result
}

const debounceSave = debounce(updateFileHandler, 1000, { trailing: true, leading: false })

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
  ({ path, content }: UpdatedFilePayload, { dispatch }) => {
    dispatch(setIsSaving(true))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return debounceSave({ path, content }, { dispatch } as any)
  },
)

export const appSlice = createSlice({
  name: "@ordo-app",
  initialState,
  reducers: {
    registerExtensions: registeredExtensionsReducer,
    unregisterExtensions: (state) => {
      state.activityExtensions = []
      state.commandExtensions = []
      state.editorPluginExtensions = []
      state.fileAssociationExtensions = []
      state.commands = []
      state.overlays = []
    },
    toggleSidebarVisibility: (state) => {
      state.isSidebarVisible = !state.isSidebarVisible
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(updatedFile.fulfilled, updatedFileReducer as any)
      .addCase(updatedFile.rejected, rejectedReducer)
  },
})

export const { registerExtensions, toggleSidebarVisibility, unregisterExtensions, setIsSaving } =
  appSlice.actions

export default appSlice.reducer
