import { IOrdoFile, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { ActionListItem, Null, useCommands } from "@ordo-pink/react-utils"
import { useState } from "react"
import { BsChevronDown, BsChevronUp, BsFileEarmarkText } from "react-icons/bs"

type Props = {
  kanban: OrdoDirectoryPath
  isCurrent: boolean
  files: IOrdoFile<{ kanbans: OrdoDirectoryPath[] }>[]
}

export default function KanbanFileReference({ kanban, files, isCurrent }: Props) {
  const { emit } = useCommands()

  const [isExpanded, setIsExpanded] = useState(false)

  const Chevron = isExpanded ? BsChevronDown : BsChevronUp

  return (
    <ActionListItem
      key={kanban}
      Icon={() => null}
      isCurrent={isCurrent}
      text={`${kanban.slice(1, -1)}`}
      onClick={() => {
        emit("kanban.open-kanban-board", kanban)
      }}
    >
      <Chevron
        className="shrink-0"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()

          setIsExpanded((v) => !v)
        }}
      />

      {Either.fromBoolean(isExpanded).fold(Null, () =>
        files.map((kanbanFile) => (
          <div key={kanbanFile.path}>
            <ActionListItem
              style={{ paddingLeft: "2rem" }}
              Icon={BsFileEarmarkText}
              isCurrent={false}
              text={kanbanFile.readableName}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                emit("editor.open-file-in-editor", kanbanFile.path)
              }}
            />
          </div>
        )),
      )}
    </ActionListItem>
  )
}
