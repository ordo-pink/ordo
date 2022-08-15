import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    name: "Open Editor",
    description: "Switch to Editor view.",
    event: "@activity-bar/open-editor",
    icon: "HiOutlineDocumentText",
    accelerator: "CommandOrControl+Shift+E",
  },
  {
    name: "Open Graph",
    description: "Switch to Graph view.",
    event: "@activity-bar/open-graph",
    icon: "HiOutlineShare",
    accelerator: "CommandOrControl+Shift+G",
  },
  {
    name: "Open Checkboxes",
    description: "Switch to Checkboxes view.",
    event: "@activity-bar/open-checkboxes",
    icon: "HiOutlineCheckCircle",
    accelerator: "CommandOrControl+Shift+C",
  },
  {
    name: "Open Settings",
    description: "Switch to Settings view.",
    event: "@activity-bar/open-settings",
    icon: "HiOutlineCog",
    accelerator: "CommandOrControl+,",
  },
  {
    name: "Open Welcome Page",
    description: "Switch to Welcome Page.",
    event: "@activity-bar/open-welcome-page",
    icon: "HiOutlineInbox",
    accelerator: "CommandOrControl+Alt+W",
  },
]);
