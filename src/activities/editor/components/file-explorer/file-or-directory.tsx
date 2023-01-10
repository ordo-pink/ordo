import Directory from "$activities/editor/components/file-explorer/directory"
import File from "$activities/editor/components/file-explorer/file"

import Null from "$core/components/null"
import { isOrdoDirectory } from "$core/guards/is-fs-entity"
import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"

type Props = {
  item: Nullable<OrdoFile | OrdoDirectory>
}

export default function FileOrDirectory({ item }: Props) {
  return Either.fromNullable(item).fold(Null, (fileOrDirectory) =>
    Either.fromBoolean(isOrdoDirectory(fileOrDirectory)).fold(
      () => <File file={fileOrDirectory as OrdoFile} />,
      () => <Directory directory={fileOrDirectory as OrdoDirectory} />,
    ),
  )
}
