import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { useModal } from "@ordo-pink/react-utils"
import UploadFilesModal from "../../components/upload-files-modal"

export const uploadFile = ({ payload }: CommandContext<IOrdoDirectory>) => {
  const { showModal } = useModal()

  showModal(() => <UploadFilesModal parent={payload} />)
}
