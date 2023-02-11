import { CaseReducer } from "@reduxjs/toolkit"

import { getItemParent } from "$containers/app/store/reducers/common"
import { AppState } from "$containers/app/types"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

export const removedReducer: CaseReducer<AppState> = (state, { payload }) => {
  Either.fromNullable(payload)
    .chain(getItemParent(state.personalProject))
    .chain((parent) =>
      Either.of(parent.children.findIndex((child) => child.raw.path === payload.path)).chain(
        (index) => Either.fromBoolean(!!~index).map(() => ({ parent, index })),
      ),
    )
    .fold(noOp, ({ parent, index }) => {
      parent.children.splice(index, 1)
    })
}
