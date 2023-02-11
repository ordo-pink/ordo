import { IOrdoDirectory, IOrdoFile, Nullable, OrdoDirectory } from "@ordo-pink/core"
import Directory from "$activities/editor/components/file-explorer/directory"
import File from "$activities/editor/components/file-explorer/file"

import Null from "$core/components/null"
import { Either } from "$core/utils/either"

type Props = {
  item: Nullable<IOrdoFile | IOrdoDirectory>
}

export default function FileOrDirectory({ item }: Props) {
  return Either.fromNullable(item).fold(Null, (fileOrDirectory) =>
    Either.fromBoolean(OrdoDirectory.isOrdoDirectory(fileOrDirectory)).fold(
      () => <File file={fileOrDirectory as IOrdoFile} />,
      () => <Directory directory={fileOrDirectory as IOrdoDirectory} />,
    ),
  )
}
