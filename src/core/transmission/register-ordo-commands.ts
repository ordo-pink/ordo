import { Transmission } from "@core/transmission";
import { Command } from "@containers/app/types";

export const registerCommands =
	(commands: Command[]) =>
	async (transmission: Transmission): Promise<void> => {
		for (const command of commands) {
			await transmission.emit("@app/register-command", command);
		}
	};
