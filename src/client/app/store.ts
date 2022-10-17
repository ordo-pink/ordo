import type { Nullable } from "@core/types"
import type { LocalSettings, OrdoFile, OrdoDirectory, UserSettings } from "@core/app/types"
import type { RootNode } from "@core/editor/types"

import debounce from "lodash/debounce"
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AsyncThunkPayloadCreator,
} from "@reduxjs/toolkit"

export type AppState = {
  userSettings: UserSettings
  localSettings: LocalSettings
  personalDirectory: Nullable<OrdoDirectory>
  currentFileRaw: string
  currentFile: Nullable<OrdoFile>
  sideBarWidth: number
  isLoading: boolean
  isSideBarAvailable: boolean
}

const initialState: AppState = {
  userSettings: {} as UserSettings,
  localSettings: {} as LocalSettings,
  personalDirectory: null,
  currentFileRaw: "",
  currentFile: null,
  sideBarWidth: 30,
  isLoading: false,
  isSideBarAvailable: false,
}

export const getUserSettings = createAsyncThunk("@app/getUserSettings", async () =>
  window.ordo.emit<UserSettings>({ type: "@app/getUserSettings" })
)

export const getLocalSettings = createAsyncThunk("@app/getLocalSettings", () =>
  window.ordo.emit<LocalSettings>({ type: "@app/getLocalSettings" })
)

export const selectPersonalProjectDirectory = createAsyncThunk(
  "@app/selectPersonalProjectDirectory",
  () => window.ordo.emit<string>({ type: "@app/selectPersonalProjectDirectory" })
)

export const listDirectory = createAsyncThunk("@app/listDirectory", (payload: string) =>
  window.ordo.emit<OrdoDirectory, string>({ type: "@app/listDirectory", payload })
)

export const openFile = createAsyncThunk("@app/openFile", (payload: OrdoFile) =>
  window.ordo.emit<{ file: OrdoFile; raw: string }, OrdoFile>({ type: "@app/openFile", payload })
)

export const createFile = createAsyncThunk("@app/createFile", (payload: string) =>
  window.ordo.emit<OrdoDirectory, string>({ type: "@app/createFile", payload })
)

export const createDirectory = createAsyncThunk("@app/createDirectory", (payload: string) =>
  window.ordo.emit<OrdoDirectory, string>({ type: "@app/createDirectory", payload })
)

export const deleteFileOrDirectory = createAsyncThunk("@app/delete", (payload: string) =>
  window.ordo.emit<OrdoDirectory, string>({ type: "@app/delete", payload })
)

type TRenameParams = { oldPath: string; newPath: string }

export const renameFileOrDirectory = createAsyncThunk("@app/rename", (payload: TRenameParams) =>
  window.ordo.emit<OrdoDirectory, TRenameParams>({ type: "@app/rename", payload })
)

type TSaveFileParams = RootNode["data"] & { path: string }

const saveFileHandler: AsyncThunkPayloadCreator<void | undefined, TSaveFileParams> = async (
  payload: TSaveFileParams,
  { dispatch }
) => {
  dispatch(setIsLoading(true))

  await window.ordo.emit<OrdoDirectory, TSaveFileParams>({
    type: "@app/saveFile",
    payload,
  })

  dispatch(setIsLoading(false))
}

const debounceSaveFileHandler = debounce(saveFileHandler, 200, { trailing: true, leading: false })

export const saveFile = createAsyncThunk("@app/saveFile", debounceSaveFileHandler)

export const appSlice = createSlice({
  name: "@app",
  initialState,
  reducers: {
    setUserSetting: <Key extends keyof UserSettings>(
      state: AppState,
      action: PayloadAction<[Key, UserSettings[Key]]>
    ) => {
      const [key, value] = action.payload
      state.userSettings[key] = value

      window.ordo.emit(action)
    },
    setLocalSetting: <Key extends keyof LocalSettings>(
      state: AppState,
      action: PayloadAction<[Key, LocalSettings[Key]]>
    ) => {
      const [key, value] = action.payload
      state.localSettings[key] = value

      window.ordo.emit(action)
    },
    setSideBarWidth: (state: AppState, action: PayloadAction<number>) => {
      if (action.payload < 1) {
        state.sideBarWidth = 0
        return
      }

      state.sideBarWidth = action.payload
    },
    toggleSideBar: (state: AppState) => {
      if (state.sideBarWidth > 0) {
        state.sideBarWidth = 0
        return
      }

      state.sideBarWidth = 30
    },
    enableSideBar: (state: AppState) => {
      state.isSideBarAvailable = true
    },
    disableSideBar: (state: AppState) => {
      state.isSideBarAvailable = false
    },
    setIsLoading: (state: AppState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserSettings.fulfilled, (state, action) => {
        state.userSettings = action.payload
      })
      .addCase(getLocalSettings.fulfilled, (state, action) => {
        state.localSettings = action.payload
      })
      .addCase(selectPersonalProjectDirectory.fulfilled, (state, action) => {
        state.userSettings["project.personal.directory"] = action.payload
      })
      .addCase(listDirectory.fulfilled, (state, action) => {
        state.personalDirectory = action.payload
      })
      .addCase(openFile.fulfilled, (state, action) => {
        state.currentFileRaw = action.payload.raw
        state.currentFile = action.payload.file
      })
      .addCase(deleteFileOrDirectory.fulfilled, (state, action) => {
        state.personalDirectory = action.payload
      })
      .addCase(renameFileOrDirectory.fulfilled, (state, action) => {
        state.personalDirectory = action.payload
      })
      .addCase(createDirectory.fulfilled, (state, action) => {
        state.personalDirectory = action.payload
      })
      .addCase(createFile.fulfilled, (state, action) => {
        state.personalDirectory = action.payload
      })
      .addCase(saveFile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(saveFile.fulfilled, (state, action) => {
        if (action.payload) state.personalDirectory = action.payload
      })
  },
})

export const {
  setUserSetting,
  setLocalSetting,
  setSideBarWidth,
  toggleSideBar,
  enableSideBar,
  disableSideBar,
  setIsLoading,
} = appSlice.actions

export default appSlice.reducer
