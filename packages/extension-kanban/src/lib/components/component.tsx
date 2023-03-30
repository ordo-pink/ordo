import { Either } from "@ordo-pink/either"
import { Null } from "@ordo-pink/react-utils"
import { useRouteParams } from "@ordo-pink/react-utils"
import Kanban from "./kanban"

export default function KanbanActivity() {
  const routeParams = useRouteParams<{ board: string }>()

  return Either.fromNullable(routeParams)
    .chain((params) => Either.fromNullable(params.board))
    .fold(Null, (path) => (
      <div className="h-[95vh]">
        <Kanban directoryPath={`/${path}/`} />
      </div>
    ))
}
