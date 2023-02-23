import { OrdoFilePath, OrdoFile } from "@ordo-pink/fs-entity"
import { useSearchParams } from "react-router-dom"

export const useFileParentBreadcrumbs = () => {
  const [query] = useSearchParams()
  const path = query.get("path") as OrdoFilePath
  return OrdoFile.isValidPath(path) ? OrdoFile.getParentPath(path) : null
}
