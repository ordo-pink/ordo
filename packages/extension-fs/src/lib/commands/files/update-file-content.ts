import { CommandContext, IOrdoFile } from "@ordo-pink/common-types"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$ } from "@ordo-pink/stream-drives"

export const updateFileContent = ({
  payload,
  logger,
}: CommandContext<{ file: IOrdoFile; content: string }>) => {
  const driver = fsDriver$.getValue()
  const { emit } = useCommands()

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
