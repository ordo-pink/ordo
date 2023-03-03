import { useWorkspaceWithSidebar } from "@ordo-pink/react-utils"
import { Switch } from "@ordo-pink/switch"
import Helmet from "react-helmet"
import { useTranslation } from "react-i18next"
import { Navigate, useParams } from "react-router-dom"
import CalendarFeature from "./features/calendar"
import CommandPaletteFeature from "./features/command-palette"
import CrossDeviceAccessFeature from "./features/cross-device-access"
import CrossFileLinksFeature from "./features/cross-file-links"
import ExtensionStoreFeature from "./features/extension-store"
import FreeForeverFeature from "./features/free-forever"
import KanbanFeature from "./features/kanban"
import OpenSourceFeature from "./features/open-source"
import PlainFilesFeature from "./features/plain-files"
import PublicSharingFeature from "./features/public-sharing"
import RichTextEditorFeature from "./features/rich-text-editor"
import SelfHostingFeature from "./features/self-hosting"
import TagsFeature from "./features/tags"
import TeamFoldersFeature from "./features/team-folders"
import FeaturesSidebar from "./sidebar"

const GoToRichTextEditorFeature = () => <Navigate to="/features/rich-text-editor" />

export default function Settings() {
  const Workspace = useWorkspaceWithSidebar()

  const { feature } = useParams()

  const Component = Switch.of(feature)
    .case("rich-text-editor", () => RichTextEditorFeature)
    .case("plain-files", () => PlainFilesFeature)
    .case("command-palette", () => CommandPaletteFeature)
    .case("free-forever", () => FreeForeverFeature)
    .case("open-source", () => OpenSourceFeature)
    .case("cross-file-links", () => CrossFileLinksFeature)
    .case("calendar", () => CalendarFeature)
    .case("tags", () => TagsFeature)
    .case("self-hosting", () => SelfHostingFeature)
    .case("cross-device-access", () => CrossDeviceAccessFeature)
    .case("extension-store", () => ExtensionStoreFeature)
    .case("public-sharing", () => PublicSharingFeature)
    .case("kanban", () => KanbanFeature)
    .case("team-folders", () => TeamFoldersFeature)
    .default(() => GoToRichTextEditorFeature)

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-features/title")

  return (
    <Workspace sidebarChildren={<FeaturesSidebar />}>
      <Helmet>
        <title>
          {"Ordo.pink | "}
          {translatedTitle}
        </title>
      </Helmet>

      <div className="w-full px-4 py-12 flex flex-col space-y-8 items-center">
        <Component />
      </div>
    </Workspace>
  )
}
