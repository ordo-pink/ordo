import { CaseReducer } from "@reduxjs/toolkit"

import { AppState } from "$containers/app/types"

export const rejectedReducer: CaseReducer<AppState> = (_, { error }) => {
  // TODO: Collect errors
  // eslint-disable-next-line no-console
  console.error(error)
}
