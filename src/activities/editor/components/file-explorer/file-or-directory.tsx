import Directory from "$activities/editor/components/file-explorer/directory"
import File from "$activities/editor/components/file-explorer/file"
import Null from "$core/components/null"
import { isDirectory } from "$core/guards/is-directory.guard"
import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"

type Props = {
  item: Nullable<OrdoFile | OrdoDirectory>
}

export default function FileOrDirectory({ item }: Props) {
  return Either.fromNullable(item).fold(Null, (fileOrDirectory) =>
    isDirectory(fileOrDirectory) ? (
      <Directory item={fileOrDirectory} />
    ) : (
      <File item={fileOrDirectory} />
    ),
  )
}
