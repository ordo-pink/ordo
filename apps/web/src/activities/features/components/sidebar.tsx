import { useTranslation } from "react-i18next"
import { AiOutlineMenu, AiOutlineTeam } from "react-icons/ai"
import {
  BsCalendar,
  BsFile,
  BsJournalRichtext,
  BsKanban,
  BsLink45Deg,
  BsPuzzle,
  BsServer,
  BsShare,
  BsTags,
} from "react-icons/bs"
import { TbDevices2, TbFreeRights, TbBrandOpenSource } from "react-icons/tb"
import { useNavigate, useParams } from "react-router-dom"
import ActionListItem from "../../../core/components/action-list/item"
import ComingSoonBadge from "../../../core/components/badge/coming-soon"

export default function FeaturesSidebar() {
  const navigate = useNavigate()
  const { feature } = useParams()

  const { t } = useTranslation()

  const translatedSpring = t("@ordo-activity-features/spring")
  const translatedSummer = t("@ordo-activity-features/summer")
  const translatedCalendarTitle = t("@ordo-activity-features/calendar-title")
  const translatedCommandPaletteTitle = t("@ordo-activity-features/command-palette-title")
  const translatedCrossDeviceAccessTitle = t("@ordo-activity-features/cross-device-access-title")
  const translatedCrossFileLinksTitle = t("@ordo-activity-features/cross-file-links-title")
  const translatedExtensionStoreTitle = t("@ordo-activity-features/extension-store-title")
  const translatedFreeForeverTitle = t("@ordo-activity-features/free-forever-title")
  const translatedKanbanTitle = t("@ordo-activity-features/kanban-title")
  const translatedOpenSourceTitle = t("@ordo-activity-features/open-source-title")
  const translatedPlainFilesTitle = t("@ordo-activity-features/plain-files-title")
  const translatedPublicSharingTitle = t("@ordo-activity-features/public-sharing-title")
  const translatedRichTextEditorTitle = t("@ordo-activity-features/rich-text-editor-title")
  const translatedSelfHostingTitle = t("@ordo-activity-features/self-hosting-title")
  const translatedTagsTitle = t("@ordo-activity-features/tags-title")
  const translatedTeamFoldersTitle = t("@ordo-activity-features/team-folders-title")

  return (
    <div className="h-full p-2">
      <ActionListItem
        Icon={BsJournalRichtext}
        text={translatedRichTextEditorTitle}
        isCurrent={feature === "rich-text-editor"}
        onClick={() => navigate("/features/rich-text-editor")}
      />

      <ActionListItem
        Icon={BsFile}
        text={translatedPlainFilesTitle}
        isCurrent={feature === "plain-files"}
        onClick={() => navigate("/features/plain-files")}
      />

      <ActionListItem
        Icon={AiOutlineMenu}
        text={translatedCommandPaletteTitle}
        isCurrent={feature === "command-palette"}
        onClick={() => navigate("/features/command-palette")}
      />

      <ActionListItem
        Icon={TbFreeRights}
        text={translatedFreeForeverTitle}
        isCurrent={feature === "free-forever"}
        onClick={() => navigate("/features/free-forever")}
      />

      <ActionListItem
        Icon={TbBrandOpenSource}
        text={translatedOpenSourceTitle}
        isCurrent={feature === "open-source"}
        onClick={() => navigate("/features/open-source")}
      />

      <ActionListItem
        Icon={BsLink45Deg}
        text={translatedCrossFileLinksTitle}
        isCurrent={feature === "cross-file-links"}
        onClick={() => navigate("/features/cross-file-links")}
      >
        <ComingSoonBadge>{translatedSpring}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={BsCalendar}
        text={translatedCalendarTitle}
        isCurrent={feature === "calendar"}
        onClick={() => navigate("/features/calendar")}
      >
        <ComingSoonBadge>{translatedSpring}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={BsTags}
        text={translatedTagsTitle}
        isCurrent={feature === "tags"}
        onClick={() => navigate("/features/tags")}
      >
        <ComingSoonBadge>{translatedSpring}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={BsServer}
        text={translatedSelfHostingTitle}
        isCurrent={feature === "self-hosting"}
        onClick={() => navigate("/features/self-hosting")}
      >
        <ComingSoonBadge>{translatedSpring}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={TbDevices2}
        text={translatedCrossDeviceAccessTitle}
        isCurrent={feature === "cross-device-access"}
        onClick={() => navigate("/features/cross-device-access")}
      >
        <ComingSoonBadge>{translatedSpring}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={BsShare}
        text={translatedPublicSharingTitle}
        isCurrent={feature === "public-sharing"}
        onClick={() => navigate("/features/public-sharing")}
      >
        <ComingSoonBadge>{translatedSpring}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={BsKanban}
        text={translatedKanbanTitle}
        isCurrent={feature === "kanban"}
        onClick={() => navigate("/features/kanban")}
      >
        <ComingSoonBadge>{translatedSpring}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={BsPuzzle}
        text={translatedExtensionStoreTitle}
        isCurrent={feature === "extension-store"}
        onClick={() => navigate("/features/extension-store")}
      >
        <ComingSoonBadge>{translatedSummer}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={AiOutlineTeam}
        text={translatedTeamFoldersTitle}
        isCurrent={feature === "team-folders"}
        onClick={() => navigate("/features/team-folders")}
      >
        <ComingSoonBadge>{translatedSummer}</ComingSoonBadge>
      </ActionListItem>
    </div>
  )
}
