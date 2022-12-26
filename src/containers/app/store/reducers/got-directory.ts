import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"

import { getItemParent } from "$containers/app/store/reducers/common"
import { AppState } from "$containers/app/types"
import { OrdoDirectory } from "$core/types"
import { Either } from "$core/utils/either"

export const gotDirectoryReducer: CaseReducer<AppState, PayloadAction<OrdoDirectory>> = (
  state,
  { payload },
) => {
  Either.fromNullable(payload).map((directory) =>
    Either.fromBoolean(directory.path !== "/")
      .map(() => directory)
      .chain(getItemParent(state.personalProject))
      .fold(
        () => void (state.personalProject = directory),
        (parent) => parent.children.push(directory),
      ),
  )
}
