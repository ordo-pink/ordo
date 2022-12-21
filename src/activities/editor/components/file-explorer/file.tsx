import { BsFileText } from "react-icons/bs"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"

import ActionListItem from "$core/components/action-list/item"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { OrdoFile } from "$core/types"

type Props = {
  item: OrdoFile
}

export default function File({ item }: Props) {
  const navigate = useNavigate()
  const [query] = useSearchParams()

  const isCurrent = query.has("path") && query.get("path") === item.path

  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)
  const association = fileAssociations.find((assoc) =>
    assoc.fileExtensions.includes(item.extension),
  )
  const Icon = association && association.Icon ? association.Icon : BsFileText

  const paddingLeft = `${item.depth * 10}px`

  const handleClick = () => {
    navigate({
      pathname: "/editor",
      search: createSearchParams({
        association: association ? association.name : "unsupported",
        path: item.path,
      }).toString(),
    })
  }

  return (
    <ActionListItem
      style={{ paddingLeft }}
      text={item.readableName}
      Icon={Icon}
      onClick={handleClick}
      isCurrent={isCurrent}
    />
  )
}
