import { addCommand } from "@client/command-palette/store"
import { useAppDispatch } from "@client/state"
import { OrdoCommand } from "@core/types"
import { useEffect } from "react"
import { selectActivity } from "../store"

export const useActivityBarCommands = () => {
  const dispatch = useAppDispatch()

  const commands: OrdoCommand<string>[] = [
    {
      title: "@editor/open-activity",
      icon: "BsLayoutTextWindow",
      accelerator: "ctrl+shift+e",
      showInCommandPalette: true,
      action: () => dispatch(selectActivity("editor")),
    },
    {
      title: "@notifications/open-activity",
      icon: "BsBell",
      accelerator: "ctrl+alt+n",
      showInCommandPalette: true,
      action: () => dispatch(selectActivity("notifications")),
    },
    {
      title: "@account/open-activity",
      icon: "BsPerson",
      accelerator: "ctrl+alt+a",
      showInCommandPalette: true,
      action: () => dispatch(selectActivity("account")),
    },
    {
      title: "@achievements/open-activity",
      icon: "BsAward",
      accelerator: "ctrl+shift+y",
      showInCommandPalette: true,
      action: () => dispatch(selectActivity("achievements")),
    },
    {
      title: "@extensions/open-activity",
      icon: "BsPuzzle",
      accelerator: "ctrl+alt+e",
      showInCommandPalette: true,
      action: () => dispatch(selectActivity("extensions")),
    },
    {
      title: "@settings/open-activity",
      icon: "FaCogs",
      accelerator: "ctrl+,",
      showInCommandPalette: true,
      action: () => dispatch(selectActivity("settings")),
    },
  ]

  useEffect(() => {
    commands.forEach((command) => dispatch(addCommand(command)))
  }, [])
}
