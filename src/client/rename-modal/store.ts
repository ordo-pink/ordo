import type { Nullable } from "@core/types"
import type { OrdoDirectory, OrdoFile } from "@core/app/types"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type RenameModalState = {
  isShown: boolean
  item: Nullable<OrdoFile | OrdoDirectory>
}

const initialState: RenameModalState = {
  isShown: false,
  item: null,
}

export const renameModalSlice = createSlice({
  name: "@rename-modal",
  initialState,
  reducers: {
    showRenameModal: (state, action: PayloadAction<Nullable<OrdoFile | OrdoDirectory>>) => {
      state.isShown = true

      if (action.payload) {
        state.item = action.payload
      }
    },
    hideRenameModal: (state) => {
      state.isShown = false
      state.item = null
    },
  },
})

export const { showRenameModal, hideRenameModal } = renameModalSlice.actions

export default renameModalSlice.reducer
