import { useParams } from "react-router-dom"

import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"

export const useFileAssociation = () => {
  const { extension } = useParams()
  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)

  if (!extension) return null

  return (
    fileAssociations.find((association) => association.fileExtensions.includes(`.${extension}`)) ??
    null
  )
}
