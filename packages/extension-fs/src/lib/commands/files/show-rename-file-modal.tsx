import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { wieldModal } from "@ordo-pink/react-utils"
import RenameFileModal from "../../components/rename-file-modal"

export const showRenameFileModal: CommandHandler<IOrdoFile> = ({ payload }) => {
  const { showModal } = wieldModal()

  showModal(() => <RenameFileModal file={payload} />)
}
