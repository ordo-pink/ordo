import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import {
  IOrdoDirectory,
  IOrdoFile,
  OrdoFilePath,
  OrdoDirectoryPath,
  IOrdoFileRaw,
} from "@ordo-pink/fs-entity"
import { Draft } from "@reduxjs/toolkit"
import { findParent, findOrdoFile } from "../../../../core/utils/fs-helpers"

export const getItemParent =
  (personalProject: Draft<Nullable<IOrdoDirectory>>) =>
  (item: IOrdoFile | IOrdoDirectory | OrdoFilePath | OrdoDirectoryPath) => {
    return Either.fromNullable(personalProject).chain((root) =>
      Either.fromNullable(findParent(item, root)),
    )
  }

export const getFile =
  (personalProject: Draft<Nullable<IOrdoDirectory>>) => (item: IOrdoFileRaw) => {
    return Either.fromNullable(personalProject?.path)
      .map(() => personalProject as NonNullable<typeof personalProject>)
      .chain((root) => Either.fromNullable(findOrdoFile(item.path, root)))
  }
