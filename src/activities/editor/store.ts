import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { EditorState } from "$activities/editor/types"
import { OrdoFile } from "$core/types"

const initialState: EditorState = {
  currentFile: null,
}

export const editorSlice = createSlice({
  name: "@ordo-editor",
  initialState,
  reducers: {
    selectedFile: (state, action: PayloadAction<OrdoFile>) => {
      state.currentFile = action.payload
    },
    gotFileContent: (state, action: PayloadAction<string>) => {
      state.currentFileRaw = action.payload
    },
    closedFile: (state) => {
      state.currentFile = null
      state.currentFileRaw = undefined
    },
  },
})

export const { gotFileContent, closedFile, selectedFile } = editorSlice.actions

export default editorSlice.reducer
