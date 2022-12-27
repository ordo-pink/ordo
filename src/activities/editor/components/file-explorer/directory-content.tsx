import FileOrDirectory from "$activities/editor/components/file-explorer/file-or-directory"

import Null from "$core/components/null"
import { OrdoDirectory } from "$core/types"
import { Either } from "$core/utils/either"

type Props = {
  directory: OrdoDirectory
  isExpanded: boolean
}

export default function DirectoryContent({ directory, isExpanded }: Props) {
  return Either.fromBoolean(isExpanded).fold(Null, () => (
    <>
      {directory.children.map((child) => (
        <FileOrDirectory
          key={child.path}
          item={child}
        />
      ))}
    </>
  ))
}
