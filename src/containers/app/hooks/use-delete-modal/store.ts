import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"

export type DeleteModalState = {
  isShown: boolean
  target: Nullable<OrdoFile | OrdoDirectory>
}

const initialState: DeleteModalState = {
  isShown: false,
  target: null,
}

export const deleteModalSlice = createSlice({
  name: "@delete-modal",
  initialState,
  reducers: {
    showDeleteModal: (state) => {
      state.isShown = true
    },
    hideDeleteModal: (state) => {
      state.isShown = false
      state.target = null
    },
    showDeleteFileModal: (state, action: PayloadAction<OrdoFile | OrdoDirectory>) => {
      state.isShown = true
      state.target = action.payload
    },
    showDeleteDirectoryModal: (state, action: PayloadAction<OrdoFile | OrdoDirectory>) => {
      state.isShown = true
      state.target = action.payload
    },
  },
})

export const { showDeleteModal, hideDeleteModal, showDeleteFileModal, showDeleteDirectoryModal } =
  deleteModalSlice.actions

export default deleteModalSlice.reducer
