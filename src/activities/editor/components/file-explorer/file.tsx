import ActionListItem from "$core/components/action-list/item"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch.hook"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { OrdoFile } from "$core/types"
import { Switch } from "$core/utils/switch"
import { BsFileText } from "react-icons/bs"

type Props = {
  item: OrdoFile
}

export default function File({ item }: Props) {
  const dispatch = useAppDispatch()

  // TODO: Add editor state
  const currentFile = ""
  const isCurrent = item.path === currentFile

  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)
  const association = fileAssociations.find((assoc) =>
    assoc.fileExtensions.includes(item.extension),
  )
  const Icon = association && association.Icon ? association.Icon : BsFileText

  const paddingLeft = `${item.depth * 10}px`

  const handleClick = () => {
    // TODO: Open file
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
