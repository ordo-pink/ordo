import { Nullable } from "@ordo-pink/common-types"
import { IOrdoDirectory, IOrdoFile } from "@ordo-pink/fs-entity"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FileSystemCommandsState } from "./types"
import { OrdoFSEntity } from "../../core/constants/ordo-fs-entity"

const initialState: FileSystemCommandsState = {
  isCreateModalShown: false,
  isDeleteModalShown: false,
  isRenameModalShown: false,
  entityType: OrdoFSEntity.FILE,
  parent: null,
  target: null,
  openOnCreate: true,
  openOnRename: true,
}

export const slice = createSlice({
  name: "ordo-command-file-system",
  initialState,
  reducers: {
    hideCreateModal: (state) => {
      state.parent = null
      state.entityType = OrdoFSEntity.FILE
      state.isCreateModalShown = false
      state.openOnCreate = true
    },
    showCreateFileModal: (
      state,
      action: PayloadAction<{ parent: Nullable<IOrdoDirectory>; openOnCreate?: boolean }>,
    ) => {
      state.parent = action.payload.parent
      state.openOnCreate = action.payload.openOnCreate ?? true
      state.entityType = OrdoFSEntity.FILE
      state.isCreateModalShown = true
    },
    hideRenameModal: (state) => {
      state.target = null
      state.parent = null
      state.entityType = OrdoFSEntity.FILE
      state.isRenameModalShown = false
      state.openOnRename = true
    },
    showRenameFileModal: (
      state,
      action: PayloadAction<{ target: IOrdoFile; parent: IOrdoDirectory; openOnRename?: boolean }>,
    ) => {
      state.target = action.payload.target
      state.parent = action.payload.parent
      state.openOnRename = action.payload.openOnRename ?? true
      state.entityType = OrdoFSEntity.FILE
      state.isRenameModalShown = true
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
  showRenameFileModal,
  hideRenameModal,
  showDeleteFileModal,
  showDeleteDirectoryModal,
  hideDeleteModal,
} = slice.actions

export default slice.reducer
