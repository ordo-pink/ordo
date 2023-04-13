import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { DirectoryIcon, IconSize, useCommands } from "@ordo-pink/react-utils"
import { hideCommandPalette, showCommandPalette } from "@ordo-pink/stream-command-palette"
import { drive$ } from "@ordo-pink/stream-drives"

export const handleSetFavouriteCommandPalette = () => {
  hideCommandPalette()

  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive) return

  const directories = OrdoDirectory.getDirectoriesDeep(drive.root).filter(
    (directory) =>
      directory.path !== "/" && directory.path !== "/.trash/" && !directory.metadata.isFavourite,
  )

  showCommandPalette(
    directories.map((directory) => ({
      id: directory.path,
      name: directory.readableName,
      Icon: () => (
        <DirectoryIcon
          directory={directory}
          size={IconSize.EXTRA_SMALL}
        />
      ),
      onSelect: () => {
        emit("fs.set-favourite", directory)
        hideCommandPalette()
      },
      Comment: () => (
        <div className="text-xs text-neutral-600 dark:text-neutral-400">
          {OrdoDirectory.getParentPath(directory.path)}
        </div>
      ),
    })),
  )
}

export const handleUnsetFavouriteCommandPalette = () => {
  hideCommandPalette()

  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive) return

  const directories = OrdoDirectory.getDirectoriesDeep(drive.root).filter(
    (directory) =>
      directory.path !== "/" && directory.path !== "/.trash/" && !!directory.metadata.isFavourite,
  )

  showCommandPalette(
    directories.map((directory) => ({
      id: directory.path,
      name: directory.readableName,
      Icon: () => (
        <DirectoryIcon
          directory={directory}
          size={IconSize.EXTRA_SMALL}
        />
      ),
      onSelect: () => {
        emit("fs.unset-favourite", directory)
        hideCommandPalette()
      },
      Comment: () => (
        <div className="text-xs text-neutral-600 dark:text-neutral-400">
          {OrdoDirectory.getParentPath(directory.path)}
        </div>
      ),
    })),
  )
}
