import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
	{
		name: "Clear Notifications",
		description: "Hide all those annoying warnings.",
		event: "@notifications/clear",
		icon: "HiOutlineVolumeOff",
		accelerator: "CommandOrControl+Alt+.",
	},
]);
