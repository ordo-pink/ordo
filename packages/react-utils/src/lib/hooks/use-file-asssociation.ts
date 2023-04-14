import { FileAssociation, IOrdoFile, Nullable, OrdoFilePath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { fileAssociations$ } from "@ordo-pink/stream-file-associations"
import { useEffect, useState } from "react"
import { useRouteParams, wieldRouteParams } from "./use-route"
import { useSubscription, wieldSubscription } from "./use-subscription"

export const useFileAssociations = () => {
  return useSubscription(fileAssociations$)
}

export const wieldFileAssociations = () => {
  return wieldSubscription(fileAssociations$, [])
}

export const useFileAssociationFor = (file: Nullable<IOrdoFile>) => {
  const associations = useFileAssociations()

  const [fileAssoc, setFileAssoc] = useState<Nullable<FileAssociation>>(null)

  useEffect(() => {
    Either.fromNullable(associations)
      .chain((assocs) =>
        Either.fromNullable(file).map((file) => ({ assocs, fileExtension: file.extension })),
      )
      .chain(({ assocs, fileExtension }) =>
        Either.fromNullable(assocs.find((assoc) => assoc.fileExtensions.includes(fileExtension))),
      )
      .fold(() => setFileAssoc(null), setFileAssoc)
  }, [associations, file])

  return fileAssoc
}

export const wieldFileAssociationFor = (file: Nullable<IOrdoFile>): Nullable<FileAssociation> => {
  const associations = wieldFileAssociations()

  return Either.fromNullable(associations)
    .chain((assocs) =>
      Either.fromNullable(file).map((file) => ({ assocs, fileExtension: file.extension })),
    )
    .chain(({ assocs, fileExtension }) =>
      Either.fromNullable(assocs.find((assoc) => assoc.fileExtensions.includes(fileExtension))),
    )
    .fold(
      () => null,
      (association) => association,
    )
}

export const useCurrentFileAssociation = () => {
  const associations = useFileAssociations()
  const { filePath } = useRouteParams<"filePath">()

  const [currentFileAssoc, setCurrentFileAssoc] = useState<Nullable<FileAssociation>>(null)

  useEffect(() => {
    Either.fromNullable(associations)
      .chain((assocs) => Either.fromNullable(filePath).map((path) => ({ assocs, path })))
      .map((params) => ({
        ...params,
        fileExtension: OrdoFile.getFileExtension(`/${params.path}` as OrdoFilePath),
      }))
      .chain(({ assocs, fileExtension }) =>
        Either.fromNullable(assocs.find((assoc) => assoc.fileExtensions.includes(fileExtension))),
      )
      .fold(() => setCurrentFileAssoc(null), setCurrentFileAssoc)
  }, [associations, filePath])

  return currentFileAssoc
}

export const wieldCurrentFileAssociation = (): Nullable<FileAssociation> => {
  const associations = wieldFileAssociations()
  const { filePath } = wieldRouteParams<"filePath">()

  return Either.fromNullable(associations)
    .chain((assocs) => Either.fromNullable(filePath).map((path) => ({ assocs, path })))
    .map((params) => ({
      ...params,
      fileExtension: OrdoFile.getFileExtension(`/${params.path}` as OrdoFilePath),
    }))
    .chain(({ assocs, fileExtension }) =>
      Either.fromNullable(assocs.find((assoc) => assoc.fileExtensions.includes(fileExtension))),
    )
    .fold(
      () => null,
      (association) => association,
    )
}
