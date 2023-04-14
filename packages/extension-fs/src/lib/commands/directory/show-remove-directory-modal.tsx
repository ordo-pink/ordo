import { CommandHandler, IOrdoDirectory } from "@ordo-pink/common-types"
import { wieldModal } from "@ordo-pink/react-utils"
import RemoveDirectoryModal from "../../components/remove-directory-modal"

export const showRemoveDirectoryModal: CommandHandler<IOrdoDirectory> = ({ payload }) => {
  const { showModal } = wieldModal()

  showModal(() => <RemoveDirectoryModal directory={payload} />)
}
