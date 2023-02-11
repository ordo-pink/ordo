import { IOrdoDirectory } from "@ordo-pink/core"
import FileOrDirectory from "$activities/editor/components/file-explorer/file-or-directory"

import Null from "$core/components/null"
import { Either } from "$core/utils/either"

type Props = {
  /**
   * Directory the content refers to.
   */
  directory: IOrdoDirectory

  /**
   * Whether the directory is expanded or collapsed.
   */
  isExpanded: boolean
}

/**
 * DirectoryContent conditionally renders directories and files inside, depending on whether
 * it is marked `isExpanded` or not.
 */
export default function DirectoryContent({ directory, isExpanded }: Props) {
  return Either.fromBoolean(isExpanded).fold(Null, () => (
    <>
      {directory.children.map((child) => (
        <FileOrDirectory
          key={child.raw.path}
          item={child}
        />
      ))}
    </>
  ))
}
