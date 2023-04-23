import { CommandHandler, IOrdoDirectory } from "@ordo-pink/common-types"
import { wieldModal } from "@ordo-pink/react-utils"
import UploadFilesModal from "../../components/upload-files-modal"

export const uploadFile: CommandHandler<IOrdoDirectory> = ({ payload }) => {
  const { showModal } = wieldModal()

  showModal(() => <UploadFilesModal parent={payload} />)
}
