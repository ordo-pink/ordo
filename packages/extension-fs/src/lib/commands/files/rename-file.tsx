import { CommandContext, IOrdoFile } from "@ordo-pink/common-types"
import { useModal } from "@ordo-pink/react-utils"
import RenameFileModal from "../../components/rename-file-modal"

export const renameFile = ({ payload }: CommandContext<{ file: IOrdoFile }>) => {
  const { showModal } = useModal()

  showModal(() => <RenameFileModal file={payload.file} />)
}
