import {
  OrdoDirectoryPath,
  OrdoFilePath,
  IOrdoFileRaw,
  OrdoFile,
  OrdoDirectory,
} from "@ordo-pink/core"
import {
  createSlice,
  createAsyncThunk,
  AsyncThunkPayloadCreator,
  PayloadAction,
} from "@reduxjs/toolkit"
import { debounce } from "lodash"

import { registeredExtensionsReducer } from "$containers/app/store/reducers/registered-extensions"
import { rejectedReducer } from "$containers/app/store/reducers/rejected"
import { removedReducer } from "$containers/app/store/reducers/removed"
import { updatedFileReducer } from "$containers/app/store/reducers/updated-file"
import { AppState, UpdateFilePayload } from "$containers/app/types"
import { Either } from "$core/utils/either"
import { findParent } from "$core/utils/fs-helpers"
import { noOp } from "$core/utils/no-op"

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

const updateFileHandler: AsyncThunkPayloadCreator<IOrdoFileRaw, UpdateFilePayload> = async (
  params,
  { dispatch },
) => {
  const result = await window.ordo.api.fs.files.update(params)

  dispatch(setIsSaving(false))

  return result
}

const debounceSave = debounce(updateFileHandler, 2000, { trailing: true, leading: false })

export const createFile = createAsyncThunk(
  "@ordo-app/create-file",
  (params: { path: OrdoFilePath; content?: string }) => window.ordo.api.fs.files.create(params),
)

export const createdDirectory = createAsyncThunk(
  "@ordo-app/create-directory",
  (path: OrdoDirectoryPath) => window.ordo.api.fs.directories.create(path),
)

export const gotDirectory = createAsyncThunk("@ordo-app/get-directory", (path: OrdoDirectoryPath) =>
  window.ordo.api.fs.directories.get(path),
)

export const removedFile = createAsyncThunk("@ordo-app/remove-file", (path: OrdoFilePath) =>
  window.ordo.api.fs.files.remove(path),
)

export const removedDirectory = createAsyncThunk(
  "@ordo-app/remove-directory",
  (path: OrdoDirectoryPath) => window.ordo.api.fs.directories.remove(path),
)

export const updatedFile = createAsyncThunk(
  "@ordo-app/update-file",
  ({ path, content }: UpdateFilePayload, { dispatch }) => {
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
      .addCase(createFile.rejected, rejectedReducer)
      .addCase(createFile.fulfilled, (state, action) =>
        Either.fromNullable(action.payload)
          .map((data) =>
            OrdoDirectory.isOrdoDirectoryRaw(data) ? OrdoDirectory.from(data) : OrdoFile.from(data),
          )
          .chain((item) =>
            Either.fromNullable(findParent(item.path, state.personalProject)).map((parent) => {
              parent.children.push(item)
            }),
          )
          .fold(noOp, noOp),
      )

      .addCase(createdDirectory.rejected, rejectedReducer)
      .addCase(createdDirectory.fulfilled, (state, { payload }) =>
        Either.fromNullable(payload)
          .chain((item) => Either.fromNullable(findParent(item.path, state.personalProject)))
          .fold(noOp, (parent) => {
            parent.children.push(OrdoDirectory.from(payload))
          }),
      )

      .addCase(gotDirectory.rejected, rejectedReducer)
      .addCase(gotDirectory.fulfilled, (state, { payload }) =>
        Either.of(payload)
          .chain((directory) =>
            Either.fromBoolean(directory.path !== "/").bimap(
              () => void (state.personalProject = OrdoDirectory.from(payload)),
              () => directory,
            ),
          )
          .chain((item) => Either.fromNullable(findParent(item.path, state.personalProject)))
          .fold(noOp, (parent) => {
            parent.children.push(OrdoDirectory.from(payload))
          }),
      )

      .addCase(removedFile.rejected, rejectedReducer)
      .addCase(removedFile.fulfilled, removedReducer)

      .addCase(removedDirectory.rejected, rejectedReducer)
      .addCase(removedDirectory.fulfilled, removedReducer)

      .addCase(updatedFile.rejected, rejectedReducer)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(updatedFile.fulfilled, updatedFileReducer as any)
  },
})

export const { registerExtensions, toggleSidebarVisibility, unregisterExtensions, setIsSaving } =
  appSlice.actions

export default appSlice.reducer
