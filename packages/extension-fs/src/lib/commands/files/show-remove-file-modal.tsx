import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { wieldModal } from "@ordo-pink/react-utils"
import RemoveFileModal from "../../components/remove-file-modal"

export const showRemoveFileModal: CommandHandler<IOrdoFile> = ({ payload }) => {
  const { showModal } = wieldModal()

  showModal(() => <RemoveFileModal file={payload} />)
}
