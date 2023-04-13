import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { useModal } from "@ordo-pink/react-utils"
import CreateDirectoryModal from "../../components/create-directory-modal"

export const showCreateDirectoryModal = ({ payload }: CommandContext<IOrdoDirectory>) => {
  const { showModal } = useModal()

  showModal(() => <CreateDirectoryModal parent={payload} />)
}
