import { IOrdoFile } from "@ordo-pink/common-types"
// import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import {
  ActionListItem,
  useCommands,
  useFileAssociationFor,
  useRouteParams,
} from "@ordo-pink/react-utils"
import { BsFileEarmarkBinary } from "react-icons/bs"
// import { MouseEvent } from "react"
// import { BsFileEarmarkBinary } from "react-icons/bs"
// import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"
// import { useContextMenu } from "../../../../containers/app/hooks/use-context-menu"
// import { useAppDispatch } from "../../../../core/state/hooks/use-app-dispatch"
// import { useAppSelector } from "../../../../core/state/hooks/use-app-selector"

type Props = {
  file: IOrdoFile
  index: number
}

export default function File({ file }: Props) {
  const { emit } = useCommands()
  // const dispatch = useAppDispatch()

  // const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)

  // const navigate = useNavigate()
  // const [query] = useSearchParams()

  // const { showContextMenu } = useContextMenu()

  const params = useRouteParams()

  const fileAssoc = useFileAssociationFor(file)

  const depth = file.path.split("/").filter(Boolean).length

  const paddingLeft = `${depth * 10}px`
  const isCurrent = Boolean(params && params["filePath*"] && params["filePath*"] === file.path)

  // const association = fileAssociations.find((assoc) =>
  //   assoc.fileExtensions.includes(file.extension),
  // )

  const Icon = fileAssoc && fileAssoc.Icon ? fileAssoc.Icon : BsFileEarmarkBinary

  const handleClick = () => emit("editor.open-file", file.path)

  // const handleContextMenu = lazyBox<MouseEvent>((box) =>
  //   box
  //     .tap(preventDefault)
  //     .tap(stopPropagation)
  //     .map(({ pageX, pageY }) => ({ x: pageX, y: pageY }))
  //     .fold(({ x, y }) => dispatch(showContextMenu({ target: file, x, y }))),
  // )

  const name =
    file.extension === ".md" ? file.readableName : `${file.readableName}${file.extension}`

  return (
    <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 z-50 transition-all duration-300">
      <ActionListItem
        style={{ paddingLeft }}
        text={name}
        // Icon={Icon}
        Icon={() => <Icon file={file} />}
        isCurrent={isCurrent}
        onClick={handleClick}
        // onContextMenu={handleContextMenu}
      />
    </div>
  )
}
