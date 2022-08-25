import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    name: "file-explorer.commands.reveal-in-files",
    event: "@file-explorer/reveal-in-finder",
    icon: "HiFolder",
    accelerator: "CommandOrControl+Alt+R",
  },
  {
    name: "file-explorer.commands.copy-path",
    event: "@file-explorer/copy-path",
    icon: "HiOutlineClipboardCopy",
    accelerator: "CommandOrControl+Alt+C",
  },
]);
