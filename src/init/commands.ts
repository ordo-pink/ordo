import { Transmission } from "@core/transmission";
import registerAppCommands from "@containers/app/register-commands";
import registerSideBarCommands from "@containers/side-bar/register-commands";
import registerEditorCommands from "@modules/editor/register-commands";
import registerTopBarCommands from "@modules/top-bar/register-commands";
import registerActivityBarCommands from "@modules/activity-bar/register-commands";

export const initCommands = async (transmission: Transmission) => {
	await registerAppCommands(transmission);
	await registerTopBarCommands(transmission);
	await registerEditorCommands(transmission);
	await registerSideBarCommands(transmission);
	await registerActivityBarCommands(transmission);
};
