import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { CreationType } from "@client/create-modal/creation-type"
import { OrdoDirectory } from "@core/app/types"
import { Nullable } from "@core/types"

export type CreateModalState = {
  isShown: boolean
  type: CreationType
  parent: Nullable<OrdoDirectory>
}

const initialState: CreateModalState = {
  isShown: false,
  type: CreationType.FILE,
  parent: null,
}

export const createModalSlice = createSlice({
  name: "@activity-bar",
  initialState,
  reducers: {
    showCreateModal: (state) => {
      state.isShown = true
    },
    hideCreateModal: (state) => {
      state.parent = null
      state.type = CreationType.FILE
      state.isShown = false
    },
    setModalType: (state, action: PayloadAction<CreationType>) => {
      state.type = action.payload
    },
    setParent: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
    },
    showCreateFileModal: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
      state.type = CreationType.FILE
      state.isShown = true
    },
    showCreateDirectoryModal: (state, action: PayloadAction<Nullable<OrdoDirectory>>) => {
      state.parent = action.payload
      state.type = CreationType.DIRECTORY
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
