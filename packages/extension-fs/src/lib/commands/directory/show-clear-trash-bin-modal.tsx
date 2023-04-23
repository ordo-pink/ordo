import { wieldModal } from "@ordo-pink/react-utils"
import ClearTrashBinModal from "../../components/clear-trash-bin-modal"

export const showClearTrashBinModal = () => {
  const { showModal } = wieldModal()

  showModal(() => <ClearTrashBinModal />)
}
