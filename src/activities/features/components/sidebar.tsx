import { AiOutlineMenu, AiOutlineTeam } from "react-icons/ai"
import {
  BsCalendar,
  BsFile,
  BsJournalRichtext,
  BsKanban,
  BsLink45Deg,
  BsTags,
} from "react-icons/bs"
import { TbDevices2, TbFreeRights, TbBrandOpenSource } from "react-icons/tb"
import { useNavigate, useParams } from "react-router-dom"

import ActionListItem from "$core/components/action-list/item"
import ComingSoonBadge from "$core/components/badge/coming-soon"

export default function FeaturesSidebar() {
  const { feature } = useParams()
  const navigate = useNavigate()

  return (
    <div className="h-full p-2">
      <ActionListItem
        Icon={BsJournalRichtext}
        text="Rich Text Editor"
        isCurrent={feature === "rich-text-editor"}
        onClick={() => navigate("/features/rich-text-editor")}
      />

      <ActionListItem
        Icon={BsFile}
        text="Plain Files"
        isCurrent={feature === "plain-files"}
        onClick={() => navigate("/features/plain-files")}
      />

      <ActionListItem
        Icon={AiOutlineMenu}
        text="Command Palette"
        isCurrent={feature === "command-palette"}
        onClick={() => navigate("/features/command-palette")}
      />

      <ActionListItem
        Icon={TbFreeRights}
        text="Free Forever"
        isCurrent={feature === "free-forever"}
        onClick={() => navigate("/features/free-forever")}
      />

      <ActionListItem
        Icon={TbBrandOpenSource}
        text="Open Source"
        isCurrent={feature === "open-source"}
        onClick={() => navigate("/features/open-source")}
      />

      <ActionListItem
        Icon={BsLink45Deg}
        text="Cross-file Links"
        isCurrent={feature === "cross-file-links"}
        onClick={() => navigate("/features/cross-file-links")}
      >
        <ComingSoonBadge>{"Spring 2023"}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={BsCalendar}
        text="Calendar"
        isCurrent={feature === "calendar"}
        onClick={() => navigate("/features/calendar")}
      >
        <ComingSoonBadge>{"Spring 2023"}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={BsTags}
        text="Tags"
        isCurrent={feature === "tags"}
        onClick={() => navigate("/features/tags")}
      >
        <ComingSoonBadge>{"Spring 2023"}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={TbDevices2}
        text="Cross-Device Access"
        isCurrent={feature === "cross-device-access"}
        onClick={() => navigate("/features/cross-device-access")}
      >
        <ComingSoonBadge>{"Spring 2023"}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={BsKanban}
        text="Kanban"
        isCurrent={feature === "kanban"}
        onClick={() => navigate("/features/kanban")}
      >
        <ComingSoonBadge>{"Spring 2023"}</ComingSoonBadge>
      </ActionListItem>

      <ActionListItem
        Icon={AiOutlineTeam}
        text="Team Folders"
        isCurrent={feature === "team-folders"}
        onClick={() => navigate("/features/team-folders")}
      >
        <ComingSoonBadge>{"Summer 2023"}</ComingSoonBadge>
      </ActionListItem>
    </div>
  )
}
