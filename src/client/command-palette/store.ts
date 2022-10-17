import type { OrdoCommand } from "@core/types"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type CommandPaletteState = {
  isShown: boolean
  commands: OrdoCommand<string>[]
}

const initialState: CommandPaletteState = {
  isShown: false,
  commands: [],
}

export const commandPaletteSlice = createSlice({
  name: "@activity-bar",
  initialState,
  reducers: {
    showCommandPalette: (state) => {
      state.isShown = true
    },
    hideCommandPalette: (state) => {
      state.isShown = false
    },
    addCommand: (state, action: PayloadAction<OrdoCommand<string>>) => {
      const commandRegisterred = state.commands.some(
        (command) => command.title === action.payload.title
      )

      if (!commandRegisterred) state.commands.push(action.payload)
    },
  },
})

export const { showCommandPalette, hideCommandPalette, addCommand } = commandPaletteSlice.actions

export default commandPaletteSlice.reducer
