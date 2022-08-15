import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    name: "Toggle Sidebar",
    description: "Show/hide sidebar.",
    event: "@side-bar/toggle",
    icon: "HiOutlineChevronDoubleRight",
    accelerator: "CommandOrControl+Shift+B",
  },
]);
