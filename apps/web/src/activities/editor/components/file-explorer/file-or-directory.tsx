import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoFile, IOrdoDirectory, OrdoDirectory } from "@ordo-pink/fs-entity"
import { Null } from "@ordo-pink/react-utils"
import Directory from "./directory"
import File from "./file"

type Props = {
  item: Nullable<IOrdoFile | IOrdoDirectory>
  index: number
}

export default function FileOrDirectory({ item, index }: Props) {
  return Either.fromNullable(item).fold(Null, (fileOrDirectory) =>
    Either.fromBoolean(OrdoDirectory.isOrdoDirectory(fileOrDirectory)).fold(
      () => (
        <File
          index={index}
          file={fileOrDirectory as IOrdoFile}
        />
      ),
      () => (
        <Directory
          index={index}
          directory={fileOrDirectory as IOrdoDirectory}
        />
      ),
    ),
  )
}
