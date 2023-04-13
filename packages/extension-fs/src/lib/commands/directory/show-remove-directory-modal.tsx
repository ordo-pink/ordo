import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { useModal } from "@ordo-pink/react-utils"
import RemoveDirectoryModal from "../../components/remove-directory-modal"

export const showRemoveDirectoryModal = ({ payload }: CommandContext<IOrdoDirectory>) => {
  const { showModal } = useModal()

  showModal(() => <RemoveDirectoryModal directory={payload} />)
}
