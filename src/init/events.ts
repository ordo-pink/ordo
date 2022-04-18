import { Transmission } from "@core/transmission";

import registerSideBarEvents from "@containers/side-bar/register-events";
import registerAppEvents from "@containers/app/register-events";
import registerActivityBarEvents from "@modules/activity-bar/register-events";
import registerTopBarEvents from "@modules/top-bar/register-events";
import registerFileExplorerEvents from "@modules/file-explorer/register-events";

export const initEvents = (transmission: Transmission) => {
	registerAppEvents(transmission);
	registerTopBarEvents(transmission);
	registerSideBarEvents(transmission);
	registerActivityBarEvents(transmission);
	registerFileExplorerEvents(transmission);
};
