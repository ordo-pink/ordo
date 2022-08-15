import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    icon: "HiViewGridAdd",
    name: "Open New Window",
    description: "Open a new Ordo window.",
    event: "@app/new-window",
    accelerator: "CommandOrControl+Shift+N",
  },
  {
    icon: "HiOutlineFolderOpen",
    name: "Open Folder",
    description: "Open a different folder in current window.",
    event: "@app/select-project",
    accelerator: "CommandOrControl+O",
  },
  {
    icon: "HiOutlineStop",
    name: "Close Window",
    description: "Close current window. This might not work though.",
    event: "@app/close-window",
    accelerator: "CommandOrControl+Shift+W",
  },
  {
    icon: "HiOutlineCode",
    name: "Toggle Dev Tools",
    description: "Show or hide browser developer tools.",
    event: "@app/toggle-dev-tools",
    accelerator: "CommandOrControl+Shift+I",
  },
  {
    icon: "HiOutlineRefresh",
    name: "Reload Window",
    description: "Reload current Ordo window.",
    event: "@app/reload-window",
    accelerator: "CommandOrControl+Shift+R",
  },
]);
