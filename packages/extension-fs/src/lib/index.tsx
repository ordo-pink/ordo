import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useModal } from "@ordo-pink/react-utils"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension } from "@ordo-pink/stream-extensions"
import { BsFileEarmarkPlus } from "react-icons/bs"
import { createDirectory } from "./commands/directory/create-directory"
import { listDirectory } from "./commands/directory/list-directory"
import { moveDirectory } from "./commands/directory/move-directory"
import { removeDirectory } from "./commands/directory/remove-directory"
import { updateDirectory } from "./commands/directory/update-directory"
import { createFile } from "./commands/files/create-file"
import { moveFile } from "./commands/files/move-file"
import { removeFile } from "./commands/files/remove-file"
import { updateFile } from "./commands/files/update-file"

import CreateFileModal from "./components/create-file-modal"

export default createExtension("fs", ({ commands, logger, registerContextMenuItem }) => {
  logger.debug('Initialising "fs" extension')

  commands.on("auth.logout", () => {
    logger.debug("User is logging out. Removing user data.")

    drive$.next(null)
    fsDriver$.next(null)
  })

  const CREATE_FILE_COMMAND = commands.on("fs.show-create-file-modal", ({ payload }) => {
    const { showModal } = useModal()

    showModal(() => <CreateFileModal parent={payload.parent} />)
  })

  registerContextMenuItem(CREATE_FILE_COMMAND, {
    Icon: BsFileEarmarkPlus,
    payloadCreator: (target) => target,
    shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
    accelerator: "ctrl+n",
  })

  commands.on("fs.list-directory", listDirectory)
  commands.on("fs.move-directory", moveDirectory)
  commands.on("fs.create-directory", createDirectory)
  commands.on("fs.update-directory", updateDirectory)
  commands.on("fs.remove-directory", removeDirectory)

  commands.on("fs.move-file", moveFile)
  commands.on("fs.create-file", createFile)
  commands.on("fs.update-file", updateFile)
  commands.on("fs.remove-file", removeFile)

  logger.debug('"fs" initialisation complete')
})
