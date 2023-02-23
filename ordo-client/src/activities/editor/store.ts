import { IOrdoFile } from "@ordo-pink/core"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { EditorState } from "$activities/editor/types"

const initialState: EditorState = {
  currentFile: null,
}

export const editorSlice = createSlice({
  name: "@ordo-editor",
  initialState,
  reducers: {
    selectFile: (state, action: PayloadAction<IOrdoFile>) => {
      state.currentFile = action.payload
    },
    closeFile: (state) => {
      state.currentFile = null
    },
  },
})

export const { selectFile, closeFile } = editorSlice.actions

export default editorSlice.reducer
