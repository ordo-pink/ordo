import { useModal } from "@ordo-pink/react-utils"
import ClearTrashBinModal from "../../components/clear-trash-bin-modal"

export const showClearTrashBinModal = () => {
  const { showModal } = useModal()

  showModal(() => <ClearTrashBinModal />)
}
