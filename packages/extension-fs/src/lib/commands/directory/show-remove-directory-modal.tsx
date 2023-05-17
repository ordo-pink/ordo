import { CommandHandler, OrdoDirectoryDTO } from "@ordo-pink/common-types"
import { wieldModal } from "@ordo-pink/react-utils"
import RemoveDirectoryModal from "../../components/remove-directory-modal"

export const showRemoveDirectoryModal: CommandHandler<OrdoDirectoryDTO> = ({ payload }) => {
  const { showModal } = wieldModal()

  showModal(() => <RemoveDirectoryModal directory={payload} />)
}
