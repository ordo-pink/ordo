import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    icon: "HiViewGridAdd",
    name: "app.commands.new-window",
    event: "@app/new-window",
    accelerator: "CommandOrControl+Shift+N",
  },
  {
    icon: "HiOutlineFolderOpen",
    name: "app.commands.open-folder",
    event: "@app/select-project",
    accelerator: "CommandOrControl+O",
  },
  {
    icon: "HiOutlineStop",
    name: "app.commands.close-window",
    event: "@app/close-window",
    accelerator: "CommandOrControl+Shift+W",
  },
  {
    icon: "HiOutlineCode",
    name: "app.commands.toggle-dev-tools",
    event: "@app/toggle-dev-tools",
    accelerator: "CommandOrControl+Shift+I",
  },
  {
    icon: "HiOutlineRefresh",
    name: "app.commands.reload-window",
    event: "@app/reload-window",
    accelerator: "CommandOrControl+Shift+R",
  },
]);
