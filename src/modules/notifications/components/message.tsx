import { useIcon } from "@core/hooks/use-icon";
import { Switch } from "or-else";
import React from "react";
import { NotificationMessage } from "../types";
import * as HiIcons from "react-icons/hi";
import { useAppDispatch } from "@core/state/store";

type Props = {
	message: NotificationMessage;
	index: number;
};

export const Message: React.FC<Props> = ({ message, index }) => {
	const dispatch = useAppDispatch();

	const [iconName, setIconName] = React.useState<keyof typeof HiIcons>("HiInformationCircle");
	const [color, setColor] = React.useState<string>("text-neutral-500 dark:text-neutral-300");

	const Icon = useIcon(iconName);
	const XIcon = useIcon("HiX");

	React.useEffect(() => {
		const getIconName = Switch.of(message.type)
			.case("error", () => {
				setIconName("HiEmojiSad");
				setColor("text-red-700 dark:text-red-400");
			})
			.case("warning", () => {
				setIconName("HiExclamationCircle");
				setColor("text-amber-700 dark:text-amber-400");
			})
			.case("success", () => {
				setIconName("HiEmojiHappy");
				setColor("text-emerald-700 dark:text-emerald-400");
			})
			.default(() => {
				setIconName("HiInformationCircle");
				setColor("text-neutral-500 dark:text-neutral-300");
			});

		getIconName();
	}, [message.type]);

	const handleRemoveClick = () => dispatch({ type: "@notifications/remove", payload: index });

	return (
		<div className="p-2 rounded-xl bg-neutral-300 dark:bg-neutral-500 shadow-lg">
			<h3 className="select-none uppercase flex justify-between items-center">
				<div className="flex space-x-2 items-center">
					<Icon className={color} />
					<div>
						<strong>{message.title}</strong>
					</div>
				</div>
				<div>
					<XIcon className="cursor-pointer" title="Hide notification" onClick={handleRemoveClick} />
				</div>
			</h3>
			<p className="select-none text-xs mt-1">{message.content}</p>
		</div>
	);
};
