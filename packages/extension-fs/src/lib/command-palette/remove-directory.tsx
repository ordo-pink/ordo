import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useCommands } from "@ordo-pink/react-utils"
import { hideCommandPalette, showCommandPalette } from "@ordo-pink/stream-command-palette"
import { drive$ } from "@ordo-pink/stream-drives"
import { AiFillFolder, AiOutlineFolder } from "react-icons/ai"

export const handleRemoveDirectoryCommandPalette = () => {
  hideCommandPalette()

  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive) return

  const directories = OrdoDirectory.getDirectoriesDeep(drive.root).filter(
    (directory) => directory.path !== "/.trash/" && directory.path !== "/",
  )

  showCommandPalette(
    directories.map((directory) => ({
      id: directory.path,
      name: directory.readableName,
      Icon: () => (directory.children.length > 0 ? <AiFillFolder /> : <AiOutlineFolder />),
      onSelect: () => emit("fs.show-remove-directory-modal", directory),
      Comment: () => (
        <div className="text-xs text-neutral-600 dark:text-neutral-400">{directory.path}</div>
      ),
    })),
  )
}
