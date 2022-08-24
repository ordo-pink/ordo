import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    name: "Close Tab",
    description: "Close current tab.",
    event: "@editor/close-tab",
    icon: "HiOutlineX",
    accelerator: "CommandOrControl+W",
  },
  {
    name: "Select All",
    description: "Select everything in the file",
    event: "@editor/select-all",
    icon: "HiOutlineSelector",
    accelerator: "CommandOrControl+Shift+A",
  },
]);
