import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    name: "editor.commands.close-tab",
    event: "@editor/close-tab",
    icon: "HiOutlineX",
    accelerator: "CommandOrControl+W",
  },
  {
    name: "editor.commands.select-all",
    event: "@editor/select-all",
    icon: "HiOutlineSelector",
    accelerator: "CommandOrControl+Shift+A",
  },
  {
    name: "editor.commands.paste",
    event: "@editor/paste",
    icon: "HiOutlineClipboardCopy",
    accelerator: "CommandOrControl+V",
  },
]);
