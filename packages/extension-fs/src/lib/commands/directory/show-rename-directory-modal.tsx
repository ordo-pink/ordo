import { CommandHandler, IOrdoDirectory } from "@ordo-pink/common-types"
import { wieldModal } from "@ordo-pink/react-utils"
import RenameDirectoryModal from "../../components/rename-directory-modal"

export const showRenameDirectoryModal: CommandHandler<IOrdoDirectory> = ({ payload }) => {
  const { showModal } = wieldModal()

  showModal(() => <RenameDirectoryModal directory={payload} />)
}
