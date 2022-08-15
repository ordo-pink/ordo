import { OrdoEvent } from "@core/types";

export type NotificationMessage = {
  type: "error" | "warning" | "info" | "success";
  title: string;
  content: string;
};

export type NotificationsState = {
  messages: NotificationMessage[];
};

export type NOTIFICATIONS_SCOPE = "notifications";

export type AddNotificationEvent = OrdoEvent<NOTIFICATIONS_SCOPE, "add", NotificationMessage>;
export type RemoveNotificationEvent = OrdoEvent<NOTIFICATIONS_SCOPE, "remove", number>;
export type ClearNotificationEvent = OrdoEvent<NOTIFICATIONS_SCOPE, "clear">;

export type NotificationsEvents = AddNotificationEvent & RemoveNotificationEvent & ClearNotificationEvent;
