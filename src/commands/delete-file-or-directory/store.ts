import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { DeleteFileOrDirectoryState } from "$commands/delete-file-or-directory/types"

import { OrdoDirectory, OrdoFile } from "$core/types"

const initialState: DeleteFileOrDirectoryState = {
  isShown: false,
  target: null,
}

export const slice = createSlice({
  name: "ordo-command-create-file-or-directory",
  initialState,
  reducers: {
    hideDeleteModal: (state) => {
      state.isShown = false
      state.target = null
    },
    showDeleteFileModal: (state, action: PayloadAction<OrdoFile>) => {
      state.isShown = true
      state.target = action.payload
    },
    showDeleteDirectoryModal: (state, action: PayloadAction<OrdoDirectory>) => {
      state.isShown = true
      state.target = action.payload
    },
  },
})

export const { hideDeleteModal, showDeleteFileModal, showDeleteDirectoryModal } = slice.actions

export default slice.reducer
