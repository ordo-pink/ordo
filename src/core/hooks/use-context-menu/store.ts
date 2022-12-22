import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { MouseEvent } from "react"

import { ContextMenuTemplate, ContextMenuTarget } from "$core/hooks/use-context-menu/types"

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
        event: MouseEvent
        target: ContextMenuTarget
        structure: ContextMenuTemplate
      }>,
    ) => {
      state.isShown = true
      state.x = action.payload.event.pageX
      state.y = action.payload.event.pageY
      state.structure = action.payload.structure
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
