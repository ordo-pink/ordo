import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"

import { getFile } from "$containers/app/store/reducers/common"
import { AppState } from "$containers/app/types"
import { OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

export const updatedFileReducer: CaseReducer<AppState, PayloadAction<OrdoFile>> = (
  state,
  { payload },
) => {
  Either.fromNullable(payload)
    .chain(getFile(state.personalProject))
    .fold(noOp, (item) => {
      item = payload as OrdoFile
      return item
    })
}
