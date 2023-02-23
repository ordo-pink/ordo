import { OrdoFilePath, OrdoFile } from "@ordo-pink/core"

import { useSearchParams } from "react-router-dom"

export const useFileParentBreadcrumbs = () => {
  const [query] = useSearchParams()
  const path = query.get("path") as OrdoFilePath
  return OrdoFile.getParentPath(path)
}
