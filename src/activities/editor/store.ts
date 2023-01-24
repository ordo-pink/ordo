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
    selectFile: (state, action: PayloadAction<OrdoFile>) => {
      state.currentFile = action.payload
    },
    closeFile: (state) => {
      state.currentFile = null
    },
  },
})

export const { selectFile, closeFile } = editorSlice.actions

export default editorSlice.reducer
