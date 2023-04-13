import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { useModal } from "@ordo-pink/react-utils"
import RenameDirectoryModal from "../../components/rename-directory-modal"

export const renameDirectory = ({ payload }: CommandContext<{ directory: IOrdoDirectory }>) => {
  const { showModal } = useModal()

  showModal(() => <RenameDirectoryModal directory={payload.directory} />)
}
