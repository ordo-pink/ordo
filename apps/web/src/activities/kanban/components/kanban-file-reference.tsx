import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoFile, OrdoDirectoryPath } from "@ordo-pink/fs-entity"
import { ActionListItem, Null } from "@ordo-pink/react"
import { Dispatch, SetStateAction, useState } from "react"
import { BsChevronDown, BsChevronUp, BsFileEarmarkText } from "react-icons/bs"
import { createSearchParams, useNavigate } from "react-router-dom"

type Props = {
  kanban: OrdoDirectoryPath
  isCurrent: boolean
  files: IOrdoFile<{ kanbans: OrdoDirectoryPath[] }>[]
  setCurrentKanban: Dispatch<SetStateAction<Nullable<OrdoDirectoryPath>>>
}

export default function KanbanFileReference({ kanban, files, setCurrentKanban, isCurrent }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()

  const Chevron = isExpanded ? BsChevronDown : BsChevronUp

  return (
    <ActionListItem
      key={kanban}
      Icon={() => null}
      isCurrent={isCurrent}
      text={`${kanban.slice(1, -1)}`}
      onClick={() => {
        setCurrentKanban(kanban as OrdoDirectoryPath)
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

                navigate({
                  pathname: "/editor",
                  search: createSearchParams({ path: kanbanFile.path }).toString(),
                })
              }}
            />
          </div>
        )),
      )}
    </ActionListItem>
  )
}
