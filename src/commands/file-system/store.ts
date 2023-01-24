import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { FileSystemCommandsState } from "$commands/file-system/types"

import { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import type { Nullable, OrdoDirectory, OrdoFile } from "$core/types"

const initialState: FileSystemCommandsState = {
  isCreateModalShown: false,
  isDeleteModalShown: false,
  entityType: OrdoFSEntity.FILE,
  parent: null,
  target: null,
}

export const slice = createSlice({
  name: "ordo-command-file-system",
  initialState,
  reducers: {
    hideCreateModal: (state) => {
      state.parent = null
      state.entityType = OrdoFSEntity.FILE
      state.isCreateModalShown = false
    },
    showCreateFileModal: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
      state.entityType = OrdoFSEntity.FILE
      state.isCreateModalShown = true
    },
    showCreateDirectoryModal: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
      state.entityType = OrdoFSEntity.DIRECTORY
      state.isCreateModalShown = true
    },
    hideDeleteModal: (state) => {
      state.isDeleteModalShown = false
      state.target = null
    },
    showDeleteFileModal: (state, action: PayloadAction<OrdoFile>) => {
      state.isDeleteModalShown = true
      state.target = action.payload
    },
    showDeleteDirectoryModal: (state, action: PayloadAction<OrdoDirectory>) => {
      state.isDeleteModalShown = true
      state.target = action.payload
    },
  },
})

export const {
  showCreateFileModal,
  showCreateDirectoryModal,
  hideCreateModal,
  showDeleteFileModal,
  showDeleteDirectoryModal,
  hideDeleteModal,
} = slice.actions

export default slice.reducer
