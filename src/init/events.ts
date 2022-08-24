import { Transmission } from "@core/transmission";
import registerSideBarEvents from "@containers/side-bar/register-events";
import registerAppEvents from "@containers/app/register-events";
import registerActivityBarEvents from "@modules/activity-bar/register-events";
import registerTopBarEvents from "@modules/top-bar/register-events";
import registerFileExplorerEvents from "@modules/file-explorer/register-events";
import registerEditorEvents from "@modules/editor/register-events";
import registerNotificationsEvents from "@modules/notifications/register-events";

export const initEvents = (transmission: Transmission) => {
  registerAppEvents(transmission);
  registerTopBarEvents(transmission);
  registerEditorEvents(transmission);
  registerSideBarEvents(transmission);
  registerActivityBarEvents(transmission);
  registerFileExplorerEvents(transmission);
  registerNotificationsEvents(transmission);
};
