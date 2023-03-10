import { Either } from "@ordo-pink/either"
import { noOp } from "@ordo-pink/fns"
import { IOrdoFileRaw } from "@ordo-pink/fs-entity"
import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import { getFile } from "./common"
import { AppState } from "../../types"

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
