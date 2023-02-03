import { Switch } from "@ordo-pink/switch"
import Helmet from "react-helmet"
import { useTranslation } from "react-i18next"
import { Navigate, useParams } from "react-router-dom"

import CalendarFeature from "$activities/features/components/features/calendar"
import CommandPaletteFeature from "$activities/features/components/features/command-palette"
import CrossDeviceAccessFeature from "$activities/features/components/features/cross-device-access"
import CrossFileLinksFeature from "$activities/features/components/features/cross-file-links"
import FreeForeverFeature from "$activities/features/components/features/free-forever"
import KanbanFeature from "$activities/features/components/features/kanban"
import OpenSourceFeature from "$activities/features/components/features/open-source"
import PlainFilesFeature from "$activities/features/components/features/plain-files"
import RichTextEditorFeature from "$activities/features/components/features/rich-text-editor"
import TagsFeature from "$activities/features/components/features/tags"
import TeamFoldersFeature from "$activities/features/components/features/team-folders"
import FeaturesSidebar from "$activities/features/components/sidebar"

import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace"

export default function Settings() {
  const Workspace = useWorkspaceWithSidebar()

  const { t } = useTranslation()
  const { feature } = useParams()

  const translatedTitle = t("@ordo-activity-features/title")

  const RedirectToRichTextEditorFeature = () => <Navigate to="/features/rich-text-editor" />

  const Component = Switch.of(feature)
    .case("rich-text-editor", () => RichTextEditorFeature)
    .case("plain-files", () => PlainFilesFeature)
    .case("command-palette", () => CommandPaletteFeature)
    .case("free-forever", () => FreeForeverFeature)
    .case("open-source", () => OpenSourceFeature)
    .case("cross-file-links", () => CrossFileLinksFeature)
    .case("calendar", () => CalendarFeature)
    .case("tags", () => TagsFeature)
    .case("cross-device-access", () => CrossDeviceAccessFeature)
    .case("kanban", () => KanbanFeature)
    .case("team-folders", () => TeamFoldersFeature)

    .default(() => RedirectToRichTextEditorFeature)

  return (
    <Workspace sidebarChildren={<FeaturesSidebar />}>
      <Helmet>
        <title>
          {"Ordo.pink | "}
          {translatedTitle}
        </title>
      </Helmet>

      <Component />
    </Workspace>
  )
}
