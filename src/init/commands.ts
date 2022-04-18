import { Transmission } from "@core/transmission";

import registerAppCommands from "@containers/app/register-commands";
import registerSideBarCommands from "@containers/side-bar/register-commands";
import registerTopBarCommands from "@modules/top-bar/register-commands";

export const initCommands = async (transmission: Transmission) => {
	await registerAppCommands(transmission);
	await registerTopBarCommands(transmission);
	await registerSideBarCommands(transmission);
};
