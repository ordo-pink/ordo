import { useIcon } from "@core/hooks/use-icon";
import { useAppSelector } from "@core/state/store";
import React from "react";
import { Message } from "./components/message";

export const Notifications: React.FC = () => {
	const messages = useAppSelector((state) => state.notifications.messages);

	const Bell = useIcon(messages.length ? "HiBell" : "HiOutlineBell");

	const [showNotifications, setShowNotifications] = React.useState<boolean>(true);

	const handleClick = () =>
		setShowNotifications((prev) => {
			if (prev) return false;
			else if (!prev && messages.length > 0) return true;
			return prev;
		});

	return (
		<div className="status-bar-side-container">
			<div className="status-bar-item">
				<Bell className={messages.length ? "text-yellow-700 dark:text-yellow-500" : ""} onClick={handleClick} />
			</div>

			{showNotifications && (
				<div style={{ bottom: 32, right: 10 }} className="fixed w-72 font-sans flex flex-col space-y-1">
					{messages.map((message, index) => (
						<Message key={index} message={message} index={index} />
					))}
				</div>
			)}
		</div>
	);
};
