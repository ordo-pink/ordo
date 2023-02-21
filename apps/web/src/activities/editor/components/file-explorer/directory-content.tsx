import { Either } from "@ordo-pink/either"
import { IOrdoDirectory } from "@ordo-pink/fs-entity"
import { Null } from "@ordo-pink/react-components"
import FileOrDirectory from "./file-or-directory"

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
          key={child.path}
          item={child}
        />
      ))}
    </>
  ))
}
