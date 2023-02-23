import { createSlice } from "@reduxjs/toolkit"

import { OpenFileState } from "$commands/open-file/types"

const initialState: OpenFileState = {
  isShown: false,
}

export const slice = createSlice({
  name: "ordo-open-file",
  initialState,
  reducers: {
    showOpenFile: (state) => {
      state.isShown = true
    },
    hideOpenFile: (state) => {
      state.isShown = false
    },
  },
})

export const { showOpenFile, hideOpenFile } = slice.actions

export default slice.reducer
