import { IOrdoFile, IOrdoFileRaw } from "@ordo-pink/core"
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
    .fold(noOp, (item: IOrdoFile) => {
      Object.keys(payload).forEach(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (key) => (item[key as keyof IOrdoFileRaw] = payload[key as keyof IOrdoFileRaw]),
      )
    })
}
