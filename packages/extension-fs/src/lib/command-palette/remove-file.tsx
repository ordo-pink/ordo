import { IconSize } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { FileIcon, useCommands } from "@ordo-pink/react-utils"
import { hideCommandPalette, showCommandPalette } from "@ordo-pink/stream-command-palette"
import { drive$ } from "@ordo-pink/stream-drives"

export const handleRemoveFileCommandPalette = () => {
  hideCommandPalette()

  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive) return

  const files = OrdoDirectory.getFilesDeep(drive.root)

  showCommandPalette(
    files.map((file) => ({
      id: file.path,
      name: file.readableName,
      Icon: () => (
        <FileIcon
          size={IconSize.EXTRA_SMALL}
          file={file}
        />
      ),
      onSelect: () => {
        emit("fs.show-remove-file-modal", file)
        hideCommandPalette()
      },
      Comment: () => (
        <div className="text-xs text-neutral-600 dark:text-neutral-400">
          {OrdoFile.getParentPath(file.path)}
        </div>
      ),
    })),
  )
}
