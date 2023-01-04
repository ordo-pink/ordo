import Directory from "$activities/editor/components/file-explorer/directory"
import File from "$activities/editor/components/file-explorer/file"

import Null from "$core/components/null"
import { isDirectory } from "$core/guards/is-directory"
import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"

type Props = {
  item: Nullable<OrdoFile | OrdoDirectory>
}

export default function FileOrDirectory({ item }: Props) {
  return Either.fromNullable(item).fold(Null, (fileOrDirectory) =>
    Either.fromBoolean(isDirectory(fileOrDirectory)).fold(
      () => <File file={fileOrDirectory as OrdoFile} />,
      () => <Directory directory={fileOrDirectory as OrdoDirectory} />,
    ),
  )
}
