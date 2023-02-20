import { PathBreadcrumbsItem } from "./path-breadcrumbs-item"

type Props = {
  path: string
}

export const PathBreadcrumbs = ({ path }: Props) => {
  const pathWithoutLastSlash = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path

  const chunks = pathWithoutLastSlash.split("/").filter(Boolean)

  return (
    <div className="self-start flex flex-wrap text-neutral-500 text-xs">
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
