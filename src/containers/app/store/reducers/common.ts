import { Draft } from "@reduxjs/toolkit"

import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"
import { findOrdoFile, findParent } from "$core/utils/fs-helpers"

export const getItemParent =
  (personalProject: Draft<Nullable<OrdoDirectory>>) =>
  (item: OrdoFile | OrdoDirectory | string) => {
    return Either.fromNullable(personalProject?.path)
      .map(() => personalProject as NonNullable<typeof personalProject>)
      .chain((root) => Either.fromNullable(findParent(item, root)))
  }

export const getFile = (personalProject: Draft<Nullable<OrdoDirectory>>) => (item: OrdoFile) => {
  return Either.fromNullable(personalProject?.path)
    .map(() => personalProject as NonNullable<typeof personalProject>)
    .chain((root) => Either.fromNullable(findOrdoFile(item.path, root)))
}
