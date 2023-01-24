import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"

import { getItemParent } from "$containers/app/store/reducers/common"
import { AppState } from "$containers/app/types"
import { OrdoDirectory, OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"
import { sortOrdoDirectory } from "$core/utils/fs-helpers"
import { noOp } from "$core/utils/no-op"

export const createdReducer: CaseReducer<AppState, PayloadAction<OrdoFile | OrdoDirectory>> = (
  state,
  { payload },
) => {
  Either.fromNullable(payload)
    .chain(getItemParent(state.personalProject))
    .fold(noOp, (parent) => {
      parent.children.push(payload)

      sortOrdoDirectory(parent)
    })
}
