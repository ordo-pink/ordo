import { CaseReducer } from "@reduxjs/toolkit"

import { AppState } from "$containers/app/types"

export const rejectedReducer: CaseReducer<AppState> = (_, { error }) => {
  console.error(error)
}
