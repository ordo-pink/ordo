import { IOrdoDirectory } from "@ordo-pink/fs-entity"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ColorCommandsState } from "./types"

const initialState: ColorCommandsState = {
  isShown: false,
  target: null,
}

export const slice = createSlice({
  name: "ordo-command-colors",
  initialState,
  reducers: {
    hideModal: (state) => {
      state.isShown = false
      state.target = null
    },
    showModal: (state, action: PayloadAction<IOrdoDirectory<{ color: string }>>) => {
      state.target = action.payload
      state.isShown = true
    },
  },
})

export const { showModal, hideModal } = slice.actions

export default slice.reducer
