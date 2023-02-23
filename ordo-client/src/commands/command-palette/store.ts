import { createSlice } from "@reduxjs/toolkit"

import { CommandPaletteState } from "$commands/command-palette/types"

const initialState: CommandPaletteState = {
  isShown: false,
}

export const slice = createSlice({
  name: "ordo-command-palette",
  initialState,
  reducers: {
    showCommandPalette: (state) => {
      state.isShown = true
    },
    hideCommandPalette: (state) => {
      state.isShown = false
    },
  },
})

export const { showCommandPalette, hideCommandPalette } = slice.actions

export default slice.reducer
