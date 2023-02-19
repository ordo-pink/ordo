import { createSlice } from "@reduxjs/toolkit"
import { AuthState } from "./types"

const initialState: AuthState = {
  isShown: false,
}

export const slice = createSlice({
  name: "logout",
  initialState,
  reducers: {
    showLogoutModal: (state) => {
      state.isShown = true
    },
    hideLogoutModal: (state) => {
      state.isShown = false
    },
  },
})

export const { showLogoutModal, hideLogoutModal } = slice.actions

export default slice.reducer
