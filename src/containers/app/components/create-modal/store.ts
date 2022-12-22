import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { FSEntity } from "$containers/app/constants"
import type { Nullable, OrdoDirectory } from "$core/types"

export type CreateModalState = {
  isShown: boolean
  entityType: FSEntity
  parent: Nullable<OrdoDirectory>
}

const initialState: CreateModalState = {
  isShown: false,
  entityType: FSEntity.FILE,
  parent: null,
}

export const createModalSlice = createSlice({
  name: "@create-modal",
  initialState,
  reducers: {
    showCreateModal: (state) => {
      state.isShown = true
    },
    hideCreateModal: (state) => {
      state.parent = null
      state.entityType = FSEntity.FILE
      state.isShown = false
    },
    setModalType: (state, action: PayloadAction<FSEntity>) => {
      state.entityType = action.payload
    },
    setParent: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
    },
    showCreateFileModal: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
      state.entityType = FSEntity.FILE
      state.isShown = true
    },
    showCreateDirectoryModal: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
      state.entityType = FSEntity.DIRECTORY
      state.isShown = true
    },
  },
})

export const {
  showCreateModal,
  hideCreateModal,
  setModalType,
  setParent,
  showCreateFileModal,
  showCreateDirectoryModal,
} = createModalSlice.actions

export default createModalSlice.reducer
