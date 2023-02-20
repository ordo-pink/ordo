import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoFile, IOrdoDirectory, OrdoDirectory } from "@ordo-pink/fs-entity"
import { Null } from "@ordo-pink/react-components"
import Directory from "./directory"
import File from "./file"

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
