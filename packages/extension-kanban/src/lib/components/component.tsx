import { Either } from "@ordo-pink/either"
import { Null } from "@ordo-pink/react-utils"
import { useRouteParams } from "@ordo-pink/react-utils"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import Kanban from "./kanban"

export default function KanbanActivity() {
  const { board } = useRouteParams<"board">()
  const { t } = useTranslation("kanban")

  const tTitle = t("title")
  const title = `Ordo.pink | ${tTitle}${board ? ` | ${board}` : ""}`

  return Either.fromNullable(board).fold(Null, (path) => (
    <div className="h-[95vh]">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Kanban directoryPath={`/${path}/`} />
    </div>
  ))
}