import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import {
  ContextMenuTemplate,
  ContextMenuTarget,
} from "$containers/app/hooks/use-context-menu/types"

export type ContextMenuState = {
  isShown: boolean
  x: number
  y: number
  structure: ContextMenuTemplate
  target: ContextMenuTarget
}

const initialState: ContextMenuState = {
  isShown: false,
  x: 0,
  y: 0,
  structure: {
    children: [],
  },
  target: null,
}

export const createModalSlice = createSlice({
  name: "@context-menu",
  initialState,
  reducers: {
    showContextMenu: (
      state,
      action: PayloadAction<{
        x: number
        y: number
        target: ContextMenuTarget
        structure?: { children: [] }
      }>,
    ) => {
      state.isShown = true
      state.x = action.payload.x
      state.y = action.payload.y
      state.structure = action.payload.structure ?? { children: [] }
      state.target = action.payload.target
    },
    hideContextMenu: (state) => {
      state.target = null
      state.x = 0
      state.y = 0
      state.isShown = false
      state.target = null
      state.structure = {
        children: [],
      }
    },
  },
})

export const { showContextMenu, hideContextMenu } = createModalSlice.actions

export default createModalSlice.reducer
