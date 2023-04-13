import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { useModal } from "@ordo-pink/react-utils"
import CreateFileModal from "../../components/create-file-modal"

export const showCreateFileModal = ({
  payload,
}: CommandContext<{
  parent: IOrdoDirectory
  content?: string
  openFileInEditor?: boolean
}>) => {
  const { showModal } = useModal()

  showModal(() => (
    <CreateFileModal
      parent={payload.parent}
      content={payload.content}
      openInEditor={payload.openFileInEditor}
    />
  ))
}
