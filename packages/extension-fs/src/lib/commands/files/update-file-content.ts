import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { wieldCommands, wieldFsDriver } from "@ordo-pink/react-utils"

export const updateFileContent: CommandHandler<{ file: IOrdoFile; content: string }> = ({
  payload,
  logger,
}) => {
  const driver = wieldFsDriver()
  const { emit } = wieldCommands()

  if (!driver) return

  driver.files
    .setContent(payload)
    .then(() => {
      emit("fs.update-file-content.complete", payload)
    })
    .catch((error) => {
      logger.error(error)
      emit("fs.update-file-content.error", error)
    })
}
