import { NotificationsState } from "@modules/notifications/types";

const initialState: NotificationsState = {
	messages: [{ title: "Test", content: "This is some awesome content", type: "info" }],
};

export default initialState;
