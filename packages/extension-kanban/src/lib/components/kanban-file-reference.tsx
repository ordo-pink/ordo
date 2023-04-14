import { IOrdoFile, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { ActionListItem, Null } from "@ordo-pink/react-utils"
import { useState } from "react"
import { BsChevronDown, BsChevronUp, BsFileEarmarkText } from "react-icons/bs"

type Props = {
  kanban: OrdoDirectoryPath
  isCurrent: boolean
  files: IOrdoFile<{ kanbans: OrdoDirectoryPath[] }>[]
}

export default function KanbanFileReference({ kanban, files, isCurrent }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const Chevron = isExpanded ? BsChevronDown : BsChevronUp

  return (
    <>
      <ActionListItem
        key={kanban}
        Icon={() => null}
        current={isCurrent}
        text={`${kanban.slice(1, -1)}`}
        href={`/kanban${kanban}`}
      >
        <Chevron
          className="shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()

            setIsExpanded((v) => !v)
          }}
        />
      </ActionListItem>

      {Either.fromBoolean(isExpanded).fold(Null, () =>
        files.map((kanbanFile) => (
          <div key={kanbanFile.path}>
            <ActionListItem
              style={{ paddingLeft: "2rem" }}
              Icon={BsFileEarmarkText}
              current={false}
              text={kanbanFile.readableName}
              href={`/editor${kanbanFile.path}`}
            />
          </div>
        )),
      )}
    </>
  )
}
