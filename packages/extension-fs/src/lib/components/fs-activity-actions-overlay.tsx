import { Active, useDroppable } from "@dnd-kit/core"
import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { Null, useRouteParams } from "@ordo-pink/react-utils"
import { BsArrowUpSquare, BsTrash2 } from "react-icons/bs"

type Props = {
  active: Nullable<Active>
}

export default function FSActivityActionsOverlay({ active }: Props) {
  const { path } = useRouteParams<"path">()

  const { setNodeRef: setDropParentNodeRef, isOver: isOverDropParent } = useDroppable({
    id: "action.send-to-parent",
  })

  const { setNodeRef: setRemoveNodeRef, isOver: isOverRemove } = useDroppable({
    id: "action.remove",
  })

  return Either.fromNullable(active).fold(Null, () => (
    <div className="fixed bottom-12 right-12 bg-neutral-300 dark:bg-neutral-600 rounded-lg shadow-lg flex items-center justify-center text-3xl">
      {Either.fromNullable(path).fold(Null, () => (
        <div
          ref={setDropParentNodeRef}
          className={`px-16 py-8 rounded-l-lg ${
            isOverDropParent ? "ring-neutral-500 ring-1 bg-neutral-500/10" : ""
          }`}
        >
          <BsArrowUpSquare />
        </div>
      ))}
      {Either.fromNullable(active)
        .chain((active) => Either.fromBoolean(active.id !== "/.trash/"))
        .fold(Null, () => (
          <div
            ref={setRemoveNodeRef}
            className={`px-16 py-8 ${path ? "rounded-r-lg" : "rounded-lg"} ${
              isOverRemove ? "ring-neutral-500 ring-1 bg-neutral-500/10" : ""
            }`}
          >
            <BsTrash2 />
          </div>
        ))}
    </div>
  ))
}
