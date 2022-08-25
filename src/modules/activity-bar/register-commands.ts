import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    name: "activity-bar.commands.open-editor",
    event: "@activity-bar/open-editor",
    icon: "HiOutlineDocumentText",
    accelerator: "CommandOrControl+Shift+E",
  },
  {
    name: "activity-bar.commands.open-graph",
    event: "@activity-bar/open-graph",
    icon: "HiOutlineShare",
    accelerator: "CommandOrControl+Shift+G",
  },
  {
    name: "activity-bar.commands.open-checkboxes",
    event: "@activity-bar/open-checkboxes",
    icon: "HiOutlineCheckCircle",
    accelerator: "CommandOrControl+Shift+C",
  },
  {
    name: "activity-bar.commands.open-settings",
    event: "@activity-bar/open-settings",
    icon: "HiOutlineCog",
    accelerator: "CommandOrControl+,",
  },
  {
    name: "activity-bar.commands.open-welcome-page",
    event: "@activity-bar/open-welcome-page",
    icon: "HiOutlineInbox",
    accelerator: "CommandOrControl+Alt+W",
  },
]);
