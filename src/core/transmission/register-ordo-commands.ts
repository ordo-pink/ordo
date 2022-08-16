import { Transmission } from "@core/transmission";
import { Command } from "@containers/app/types";

/**
 * Triggers registering a list of provided commands at app launch. These
 * commands will be available via TopBar command palette.
 */
export const registerCommands =
  (commands: Command[]) =>
  async (transmission: Transmission): Promise<void> => {
    for (const command of commands) {
      await transmission.emit("@app/register-command", command);
    }
  };
