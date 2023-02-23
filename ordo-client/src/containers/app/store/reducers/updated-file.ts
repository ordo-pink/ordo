import { IOrdoFileRaw } from "@ordo-pink/core"
import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"

import { getFile } from "$containers/app/store/reducers/common"
import { AppState } from "$containers/app/types"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

export const updatedFileReducer: CaseReducer<AppState, PayloadAction<IOrdoFileRaw>> = (
  state,
  { payload },
) => {
  Either.fromNullable(payload)
    .chain(getFile(state.personalProject))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .fold(noOp, (item: any) => {
      item.size = payload.size
    })
}
