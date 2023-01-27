import { PropsWithChildren } from "react"

import { useCurrentFileAssociation } from "$activities/editor/hooks/use-current-file-association"

import Null from "$core/components/null"
import PathBreadcrumbs from "$core/components/path-breadcrumbs"

type Props = PropsWithChildren<{
  image?: string
  imageAlt?: string
  title?: string
  breadcrumbsPath?: string
}>

export default function EditorPage({
  image,
  imageAlt = "",
  title,
  breadcrumbsPath,
  children,
}: Props) {
  const currentFileAssociation = useCurrentFileAssociation()
  const Icon = currentFileAssociation?.Icon ?? Null

  return (
    <div className="flex flex-col w-full relative">
      {image ? (
        <img
          className="absolute h-48 w-full top-0 left-0 right-0 object-cover"
          src={image}
          alt={imageAlt}
          title={imageAlt}
        />
      ) : (
        <div className="bg-gradient-to-tr from-red-200 via-pink-200 to-cyan-200 dark:from-zinc-600 dark:via-stone-600 dark:to-slate-600 w-full top-0 left-0 right-0 h-48 absolute" />
      )}

      <div className="text-5xl absolute left-8 top-8">
        <Icon />
      </div>

      <div className="mt-48 p-4 self-center prose prose-pink prose-headings:text-neutral-700 dark:prose-headings:text-neutral-300 w-full h-full max-h-screen caret-purple-800 dark:prose-invert dark:caret-purple-200 cursor-text">
        <PathBreadcrumbs path={breadcrumbsPath ?? ""} />

        <div className="text-5xl flex space-x-4 font-black text-neutral-700 dark:text-neutral-300">
          <div>{title}</div>
        </div>

        <div className="py-8 w-full">{children}</div>
      </div>
    </div>
  )
}
