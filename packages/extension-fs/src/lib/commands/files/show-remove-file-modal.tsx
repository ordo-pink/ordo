import { CommandContext, IOrdoFile } from "@ordo-pink/common-types"
import { useModal } from "@ordo-pink/react-utils"
import RemoveFileModal from "../../components/remove-file-modal"

export const showRemoveFileModal = ({ payload }: CommandContext<IOrdoFile>) => {
  const { showModal } = useModal()

  showModal(() => <RemoveFileModal file={payload} />)
}
