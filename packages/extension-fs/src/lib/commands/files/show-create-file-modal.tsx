import { CommandHandler, OrdoDirectoryDTO, IOrdoFile } from "@ordo-pink/common-types"
import { wieldModal } from "@ordo-pink/react-utils"
import CreateFileModal from "../../components/create-file-modal"

export const showCreateFileModal: CommandHandler<{
  parent: OrdoDirectoryDTO
  content?: string
  metadata?: IOrdoFile["metadata"]
  openFileInEditor?: boolean
}> = ({ payload }) => {
  const { showModal } = wieldModal()

  showModal(() => (
    <CreateFileModal
      parent={payload.parent}
      content={payload.content}
      metadata={payload.metadata}
    />
  ))
}
