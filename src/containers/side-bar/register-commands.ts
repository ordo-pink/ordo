import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    name: "sidebar.commands.toggle-sidebar",
    event: "@side-bar/toggle",
    icon: "HiOutlineChevronDoubleRight",
    accelerator: "CommandOrControl+Shift+B",
  },
]);
