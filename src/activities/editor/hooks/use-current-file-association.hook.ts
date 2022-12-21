import { useSearchParams } from "react-router-dom"

import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { Nullable, OrdoFile } from "$core/types"
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

  const file = findOrdoFile(path as string, tree)

  if (!file) return null

  return (
    fileAssociations.find((association) =>
      association.fileExtensions.includes((file as OrdoFile).extension),
    ) ?? null
  )
}
