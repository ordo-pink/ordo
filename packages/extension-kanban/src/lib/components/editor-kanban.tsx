import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { IconSize } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import {
  useCommandPalette,
  DirectoryIcon,
  OrdoButtonSecondary,
  useDrive,
} from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import { BsFolderCheck, BsTrash3Fill } from "react-icons/bs"
import Kanban from "./kanban"
import { OrdoKanbanNode } from "../ordo-kanban/node"

type Props = {
  node: OrdoKanbanNode
}

export default function EditorKanban({ node }: Props) {
  const { t } = useTranslation("kanban")
  const drive = useDrive()
  const { showCommandPalette, hideCommandPalette } = useCommandPalette()
  const [editor] = useLexicalComposerContext()

  const tRemoveKanban = t("remove-kanban-board")
  const tChangeKanbanDirectory = t("change-kanban-directory")

  const handleChangeDirectoryClick = () => {
    if (!drive || !editor) return

    showCommandPalette(
      OrdoDirectory.getDirectoriesDeep(drive.root).map((directory) => ({
        id: directory.path,
        name: directory.readableName,
        Comment: () => <div className="text-xs text-neutral-500">{directory.path}</div>,
        Icon: () => (
          <DirectoryIcon
            directory={directory}
            size={IconSize.EXTRA_SMALL}
          />
        ),
        onSelect: () => {
          if (!editor) return

          editor.update(() => {
            node?.setDirectory(directory.path)
            hideCommandPalette()
          })
        },
      })),
    )
  }

  const handleRemoveKanbanClick = () => {
    if (!editor) return

    editor.update(() => {
      node.remove()
    })
  }

  return (
    <div className="h-[80vh] md:h-[70vh] select-none flex flex-col">
      <div className="flex space-x-2 m-2 mt-0">
        <OrdoButtonSecondary
          center
          title={tChangeKanbanDirectory}
          onClick={handleChangeDirectoryClick}
        >
          <div className="flex space-x-2 items-center">
            <BsFolderCheck />
          </div>
        </OrdoButtonSecondary>

        <OrdoButtonSecondary
          center
          title={tRemoveKanban}
          onClick={handleRemoveKanbanClick}
        >
          <div className="flex space-x-2 items-center">
            <BsTrash3Fill />
          </div>
        </OrdoButtonSecondary>
      </div>

      <Kanban
        node={node}
        directoryPath={node.getDirectory()}
      />
    </div>
  )
}
