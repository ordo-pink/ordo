import { PropsWithChildren } from "react"

import { useCurrentFileAssociation } from "$activities/editor/hooks/use-current-file-association"

import Null from "$core/components/null"
import PathBreadcrumbs from "$core/components/path-breadcrumbs"
import { Nullable, OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"
import { getParentPath } from "$core/utils/fs-helpers"

type Props = PropsWithChildren<{
  image?: string
  imageAlt?: string
  currentFile: Nullable<OrdoFile>
}>

export default function EditorPage({ image, imageAlt = "", currentFile, children }: Props) {
  const currentFileAssociation = useCurrentFileAssociation()
  const Icon = currentFileAssociation?.Icon ?? Null

  const parentPath = getParentPath(currentFile?.path || "")

  return Either.fromNullable(currentFile).fold(
    () => (
      <div className="flex flex-col w-full relative">
        {image ? (
          <img
            className="absolute h-48 md:h-96 w-full top-0 left-0 right-0 object-cover"
            src={image}
            alt={imageAlt}
            title={imageAlt}
          />
        ) : (
          <div className="bg-gradient-to-tr from-red-200 via-pink-200 to-cyan-200 dark:from-zinc-600 dark:via-stone-600 dark:to-slate-600 w-full top-0 left-0 right-0 h-48 md:h-96 absolute" />
        )}

        <div className="mt-48 md:mt-96 p-4 self-center prose prose-pink prose-headings:text-neutral-700 dark:prose-headings:text-neutral-300 w-full h-full max-h-screen caret-purple-800 dark:prose-invert dark:caret-purple-200 cursor-text">
          <div className="py-8">{children}</div>
        </div>
      </div>
    ),
    (file) => (
      <div className="flex flex-col w-full relative">
        {image ? (
          <img
            className="absolute h-48 md:h-96 w-full top-0 left-0 right-0 object-cover"
            src={image}
            alt={imageAlt}
            title={imageAlt}
          />
        ) : (
          <div className="bg-gradient-to-tr from-red-200 via-pink-200 to-cyan-200 dark:from-zinc-600 dark:via-stone-600 dark:to-slate-600 w-full top-0 left-0 right-0 h-48 md:h-96 absolute" />
        )}

        <div className="text-5xl absolute left-8 top-8">
          <Icon />
        </div>

        <div className="mt-48 md:mt-96 p-4 self-center prose prose-pink prose-headings:text-neutral-700 dark:prose-headings:text-neutral-300 w-full h-full max-h-screen caret-purple-800 dark:prose-invert dark:caret-purple-200 cursor-text">
          <PathBreadcrumbs path={parentPath} />

          <div className="text-5xl flex space-x-4 font-black text-neutral-700 dark:text-neutral-300">
            <div>{file.readableName}</div>
          </div>

          <div className="py-8 w-full">{children}</div>
        </div>
      </div>
    ),
  )
}
