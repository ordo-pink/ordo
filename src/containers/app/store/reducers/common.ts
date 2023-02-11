import {
  IOrdoDirectory,
  IOrdoFile,
  IOrdoFileRaw,
  Nullable,
  OrdoDirectoryPath,
  OrdoFilePath,
} from "@ordo-pink/core"
import { Draft } from "@reduxjs/toolkit"

import { Either } from "$core/utils/either"
import { findOrdoFile, findParent } from "$core/utils/fs-helpers"

export const getItemParent =
  (personalProject: Draft<Nullable<IOrdoDirectory>>) =>
  (item: IOrdoFile | IOrdoDirectory | OrdoFilePath | OrdoDirectoryPath) => {
    return Either.fromNullable(personalProject).chain((root) =>
      Either.fromNullable(findParent(item, root)),
    )
  }

export const getFile =
  (personalProject: Draft<Nullable<IOrdoDirectory>>) => (item: IOrdoFileRaw) => {
    return Either.fromNullable(personalProject?.raw.path)
      .map(() => personalProject as NonNullable<typeof personalProject>)
      .chain((root) => Either.fromNullable(findOrdoFile(item.path, root)))
  }
