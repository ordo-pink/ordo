import { BsFilePlus, BsFolderPlus } from "react-icons/bs"

import FileOrDirectory from "$activities/editor/components/file-explorer/file-or-directory"
import {
  showCreateFileModal,
  showCreateDirectoryModal,
} from "$containers/app/components/create-modal/store"
import { OrdoButtonNeutral } from "$core/components/buttons"
import Null from "$core/components/null"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch.hook"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { Either } from "$core/utils/either"

export default function FileExplorer() {
  const dispatch = useAppDispatch()

  const parent = useAppSelector((state) => state.app.personalProject)

  return Either.fromNullable(parent).fold(Null, (rootDirectory) => (
    <div className="file-explorer">
      <div className="file-explorer_files-container">
        {rootDirectory.children.map((child) => (
          <FileOrDirectory
            key={child.path}
            item={child}
          />
        ))}
      </div>

      <div className="file-explorer_action-group">
        <OrdoButtonNeutral onClick={() => dispatch(showCreateFileModal(parent))}>
          <div className="flex items-center md:space-x-2">
            <BsFilePlus />
          </div>
        </OrdoButtonNeutral>
        <OrdoButtonNeutral onClick={() => dispatch(showCreateDirectoryModal(parent))}>
          <div className="flex items-center md:space-x-2">
            <BsFolderPlus />
          </div>
        </OrdoButtonNeutral>
      </div>
    </div>
  ))
}
