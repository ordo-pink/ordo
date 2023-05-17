import { CommandHandler, OrdoDirectoryDTO } from "@ordo-pink/common-types"
import { wieldModal } from "@ordo-pink/react-utils"
import RenameDirectoryModal from "../../components/rename-directory-modal"

export const showRenameDirectoryModal: CommandHandler<OrdoDirectoryDTO> = ({ payload }) => {
  const { showModal } = wieldModal()

  showModal(() => <RenameDirectoryModal directory={payload} />)
}
