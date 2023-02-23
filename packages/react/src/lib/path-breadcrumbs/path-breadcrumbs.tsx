import { Nullable } from "@ordo-pink/common-types"
import { PathBreadcrumbsItem } from "./path-breadcrumbs-item"

import "./path-breadcrumbs-item.css"

type Props = {
  path: Nullable<string>
}

export const PathBreadcrumbs = ({ path }: Props) => {
  if (!path) return null

  const pathWithoutLastSlash = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path

  const chunks = pathWithoutLastSlash.split("/").filter(Boolean)

  return (
    <div className="path-breadcrumbs">
      <PathBreadcrumbsItem chunk="/" />

      {chunks.map((chunk, index) => (
        <PathBreadcrumbsItem
          key={`${chunk}-${index}`}
          chunk={chunk}
        />
      ))}
    </div>
  )
}
