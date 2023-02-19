import { CaseReducer } from "@reduxjs/toolkit"
import { AppState } from "../../types"

export const rejectedReducer: CaseReducer<AppState> = (state, { error }) => {
  // TODO: Collect errors
  // eslint-disable-next-line no-console
  console.error(error)
}
