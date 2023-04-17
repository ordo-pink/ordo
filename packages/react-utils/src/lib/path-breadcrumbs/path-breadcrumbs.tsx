import { Nullable } from "@ordo-pink/common-types"
import { PathBreadcrumbsItem } from "./path-breadcrumbs-item"

import "./path-breadcrumbs-item.css"

type Props = {
  path: Nullable<string>
}

export const PathBreadcrumbs = ({ path }: Props) => {
  if (!path) return null

  const pathWithoutLastSlash = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path

  let chunks = pathWithoutLastSlash.split("/").filter(Boolean)

  if (chunks.length > 3) {
    chunks = chunks.slice(0, 1).concat(["..."]).concat(chunks.slice(-1))
  }

  return (
    <div
      className="path-breadcrumbs"
      title={path}
    >
      <PathBreadcrumbsItem chunk="/" />

      {chunks.map((chunk, index) => (
        <PathBreadcrumbsItem
          key={`${chunk}-${index}`}
          chunk={chunk.length < 7 ? chunk : chunk.slice(0, 6).concat("...")}
        />
      ))}
    </div>
  )
}
