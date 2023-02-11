import { OrdoFilePath } from "@ordo-pink/core"
import { useSearchParams } from "react-router-dom"

import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { findOrdoFile } from "$core/utils/fs-helpers"

export const useCurrentFileAssociation = () => {
  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)
  const tree = useAppSelector((state) => state.app.personalProject)
  const [query] = useSearchParams()

  if (query.has("association")) {
    return (
      fileAssociations.find((association) => association.name === query.get("association")) ?? null
    )
  }

  if (!query.has("path")) {
    return null
  }

  const path = query.get("path")

  const file = findOrdoFile(path as OrdoFilePath, tree)

  if (!file) return null

  return (
    fileAssociations.find((association) => association.fileExtensions.includes(file.extension)) ??
    null
  )
}
