import { Draft } from "@reduxjs/toolkit"

import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"
import { findParent } from "$core/utils/fs-helpers"

export const getItemParent =
  (personalProject: Draft<Nullable<OrdoDirectory>>) =>
  (item: OrdoFile | OrdoDirectory | string) => {
    return Either.fromNullable(personalProject?.path)
      .map(() => personalProject as NonNullable<typeof personalProject>)
      .chain((root) => Either.fromNullable(findParent(item, root)))
  }
