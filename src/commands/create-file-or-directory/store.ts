import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { CreateFileOrDirectoryState } from "$commands/create-file-or-directory/types"

import { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import type { Nullable, OrdoDirectory } from "$core/types"

const initialState: CreateFileOrDirectoryState = {
  isShown: false,
  entityType: OrdoFSEntity.FILE,
  parent: null,
}

export const slice = createSlice({
  name: "ordo-command-create-file-or-directory",
  initialState,
  reducers: {
    hideCreateModal: (state) => {
      state.parent = null
      state.entityType = OrdoFSEntity.FILE
      state.isShown = false
    },
    showCreateFileModal: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
      state.entityType = OrdoFSEntity.FILE
      state.isShown = true
    },
    showCreateDirectoryModal: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
      state.entityType = OrdoFSEntity.DIRECTORY
      state.isShown = true
    },
  },
})

export const { hideCreateModal, showCreateFileModal, showCreateDirectoryModal } = slice.actions

export default slice.reducer
