import { createSlice } from "@reduxjs/toolkit"

import { SupportState } from "$commands/user-support/types"

const initialState: SupportState = {
  isShown: false,
}

export const slice = createSlice({
  name: "support",
  initialState,
  reducers: {
    showSupportModal: (state) => {
      state.isShown = true
    },
    hideSupportModal: (state) => {
      state.isShown = false
    },
  },
})

export const { showSupportModal, hideSupportModal } = slice.actions

export default slice.reducer
