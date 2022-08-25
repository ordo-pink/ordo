import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
  {
    name: "notifications.commands.clear",
    event: "@notifications/clear",
    icon: "HiOutlineVolumeOff",
    accelerator: "CommandOrControl+Alt+.",
  },
]);
