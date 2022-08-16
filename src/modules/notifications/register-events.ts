import { registerEvents } from "@core/transmission/register-ordo-events";
import { NotificationsEvents } from "./types";

export default registerEvents<NotificationsEvents>({
  "@notifications/add": ({ draft, payload }) => {
    draft.notifications.messages.push(payload);
  },
  "@notifications/clear": ({ draft }) => {
    draft.notifications.messages = [];
  },
  "@notifications/remove": ({ draft, payload }) => {
    if (draft.notifications.messages[payload]) {
      draft.notifications.messages.splice(payload, 1);
    }
  },
});
