import PathBreadcrumbsItem from "./components/path-breadcrumbs-item"
import "./index.css"

type Props = {
  path: string
}

export default function PathBreadcrumbs({ path }: Props) {
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
