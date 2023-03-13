import { Either } from "@ordo-pink/either"
import { noOp } from "@ordo-pink/fns"
import {
  IOrdoFileRaw,
  OrdoFilePath,
  OrdoDirectoryPath,
  OrdoDirectory,
  OrdoFile,
  IOrdoFile,
} from "@ordo-pink/fs-entity"
import {
  createSlice,
  createAsyncThunk,
  AsyncThunkPayloadCreator,
  PayloadAction,
} from "@reduxjs/toolkit"
import { debounce } from "lodash"
import { registeredExtensionsReducer } from "./reducers/registered-extensions"
import { rejectedReducer } from "./reducers/rejected"
import { updatedFileReducer } from "./reducers/updated-file"
import { findOrdoFile, findParent } from "../../../core/utils/fs-helpers"
import { AppState, UpdateFilePayload } from "../types"

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

const debounceSave = debounce(updateFileHandler, 500, { trailing: true, leading: false })

export const createFile = createAsyncThunk(
  "@ordo-app/create-file",
  (params: { file: IOrdoFile; content?: string }) => window.ordo.api.fs.files.create(params),
)

export const moveFile = createAsyncThunk(
  "@ordo-app/move-file",
  async (params: { oldPath: OrdoFilePath; newPath: OrdoFilePath }) => {
    const result = await window.ordo.api.fs.files.move(params)

    return { result, params }
  },
)

export const moveDirectory = createAsyncThunk(
  "@ordo-app/move-directory",
  async (params: { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath }) => {
    const result = await window.ordo.api.fs.directories.move({
      oldPath: params.oldPath.slice(0, -1) as OrdoDirectoryPath,
      newPath: params.newPath.slice(0, -1) as OrdoDirectoryPath,
    })

    return { result, params }
  },
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
  ({ file, content }: UpdateFilePayload, { dispatch }) => {
    dispatch(setIsSaving(true))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return debounceSave({ file, content }, { dispatch } as any)
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
    updateFileMetadata: (state, action: PayloadAction<IOrdoFile>) => {
      const file = findOrdoFile(action.payload.path, state.personalProject)

      if (!file) return

      file.metadata = {
        ...file.metadata,
        ...action.payload.metadata,
      }
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
              OrdoDirectory.sort(parent.children)
            }),
          )
          .fold(noOp, noOp),
      )

      .addCase(moveFile.rejected, rejectedReducer)
      .addCase(moveFile.fulfilled, (state, action) =>
        Either.fromNullable(action.payload)
          .map((data) => {
            const oldParent = findParent(data.params.oldPath, state.personalProject)

            if (oldParent) {
              const movedItemIndex = oldParent.children.findIndex(
                ({ path }) => path === data.params.oldPath,
              )

              oldParent.children.splice(movedItemIndex, 1)
            }

            return data.result
          })
          .map((data) =>
            OrdoDirectory.isOrdoDirectoryRaw(data) ? OrdoDirectory.from(data) : OrdoFile.from(data),
          )
          .chain((item) =>
            Either.fromNullable(findParent(item.path, state.personalProject)).map((parent) => {
              parent.children.push(item)
              OrdoDirectory.sort(parent.children)
            }),
          )
          .fold(noOp, noOp),
      )

      .addCase(moveDirectory.rejected, rejectedReducer)
      .addCase(moveDirectory.fulfilled, (state, action) =>
        Either.fromNullable(action.payload)
          .map((data) => {
            const oldParent = findParent(data.params.oldPath, state.personalProject)

            if (oldParent) {
              const movedItemIndex = oldParent.children.findIndex(
                ({ path }) => path === data.params.oldPath,
              )

              oldParent.children.splice(movedItemIndex, 1)
            }

            return data.result
          })
          .map((data) => OrdoDirectory.from(data))
          .chain((item) =>
            Either.fromNullable(findParent(item.path, state.personalProject)).map((parent) => {
              parent.children.push(item)
              OrdoDirectory.sort(parent.children)
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
            OrdoDirectory.sort(parent.children)
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
      .addCase(removedFile.fulfilled, (state, { payload }) => {
        Either.fromNullable(payload)
          .chain((item) => Either.fromNullable(findParent(item.path, state.personalProject)))
          .chain((parent) =>
            Either.of(parent.children.findIndex((child) => child.path === payload.path)).chain(
              (index) => Either.fromBoolean(index !== -1).map(() => ({ parent, index })),
            ),
          )
          .fold(noOp, ({ parent, index }) => {
            parent.children.splice(index, 1)
          })
      })

      .addCase(removedDirectory.rejected, rejectedReducer)
      .addCase(removedDirectory.fulfilled, (state, { payload }) => {
        Either.fromNullable(payload)
          .chain((item) => Either.fromNullable(findParent(item.path, state.personalProject)))
          .chain((parent) =>
            Either.of(parent.children.findIndex((child) => child.path === payload.path)).chain(
              (index) => Either.fromBoolean(index !== -1).map(() => ({ parent, index })),
            ),
          )
          .fold(noOp, ({ parent, index }) => {
            parent.children.splice(index, 1)
          })
      })

      .addCase(updatedFile.rejected, rejectedReducer)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(updatedFile.fulfilled, updatedFileReducer as any)
  },
})

export const {
  registerExtensions,
  toggleSidebarVisibility,
  unregisterExtensions,
  setIsSaving,
  updateFileMetadata,
} = appSlice.actions

export default appSlice.reducer
