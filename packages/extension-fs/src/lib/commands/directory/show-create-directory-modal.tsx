import { CommandHandler, OrdoDirectoryDTO } from "@ordo-pink/common-types"
import { wieldModal } from "@ordo-pink/react-utils"
import CreateDirectoryModal from "../../components/create-directory-modal"

export const showCreateDirectoryModal: CommandHandler<OrdoDirectoryDTO> = ({ payload }) => {
  const { showModal } = wieldModal()

  showModal(() => <CreateDirectoryModal parent={payload} />)
}
