import PathBreadcrumbsItem from "$core/components/path-breadcrumbs/components/path-breadcrumbs-item"

import "$core/components/path-breadcrumbs/index.css"

type Props = {
  path: string
}

export default function PathBreadcrumbs({ path }: Props) {
  const chunks = path.slice(1).split("/")

  return (
    <div className="path-breadcrumbs">
      {chunks.map((chunk, index) => (
        <PathBreadcrumbsItem
          key={`${chunk}-${index}`}
          chunk={chunk}
        />
      ))}
    </div>
  )
}
