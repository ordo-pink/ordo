import { Nullable } from "@ordo-pink/common-types"
import { IOrdoDirectory, IOrdoFile } from "@ordo-pink/fs-entity"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FileSystemCommandsState } from "./types"
import { OrdoFSEntity } from "../../core/constants/ordo-fs-entity"

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
    showCreateFileModal: (state, action: PayloadAction<Nullable<IOrdoDirectory>>) => {
      state.parent = action.payload
      state.entityType = OrdoFSEntity.FILE
      state.isCreateModalShown = true
    },
    showCreateDirectoryModal: (state, action: PayloadAction<Nullable<IOrdoDirectory>>) => {
      state.parent = action.payload
      state.entityType = OrdoFSEntity.DIRECTORY
      state.isCreateModalShown = true
    },
    hideDeleteModal: (state) => {
      state.isDeleteModalShown = false
      state.target = null
    },
    showDeleteFileModal: (state, action: PayloadAction<IOrdoFile>) => {
      state.isDeleteModalShown = true
      state.target = action.payload
    },
    showDeleteDirectoryModal: (state, action: PayloadAction<IOrdoDirectory>) => {
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
