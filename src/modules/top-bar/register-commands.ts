import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    icon: "HiOutlineCode",
    name: "top-bar.commands.go-to-line",
    event: "@top-bar/open-go-to-line",
    accelerator: "Alt+G",
  },
  {
    icon: "HiOutlineCollection",
    name: "top-bar.commands.go-to-commands",
    event: "@top-bar/open-command-palette",
    accelerator: "CommandOrControl+Shift+P",
  },
  {
    icon: "HiOutlineSearchCircle",
    name: "top-bar.commands.go-to-file",
    event: "@top-bar/open-go-to-file",
    accelerator: "CommandOrControl+P",
  },
  {
    icon: "HiOutlineSearch",
    name: "top-bar.commands.search-in-file",
    event: "@top-bar/open-search-in-file",
    accelerator: "CommandOrControl+F",
  },
]);
