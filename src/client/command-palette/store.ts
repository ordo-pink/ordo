import type { OrdoCommand } from "@core/types"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type CommandPaletteState = {
  isShown: boolean
  commands: OrdoCommand<string>[]
  hotkeys: Record<string, OrdoCommand<string>["action"]>
}

const initialState: CommandPaletteState = {
  isShown: false,
  commands: [],
  hotkeys: {},
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

      if (commandRegisterred) return

      state.commands.push(action.payload)

      if (action.payload.accelerator) {
        state.hotkeys[action.payload.accelerator] = action.payload.action
      }
    },
  },
})

export const { showCommandPalette, hideCommandPalette, addCommand } = commandPaletteSlice.actions

export default commandPaletteSlice.reducer
