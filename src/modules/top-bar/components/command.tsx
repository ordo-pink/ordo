import React from "react";

import { Command as TCommand } from "@containers/app/types";
import { Accelerator } from "@modules/top-bar/components/accelerator";
import { useAppDispatch } from "@core/state/store";
import { useIcon } from "@core/hooks/use-icon";

import "@modules/top-bar/components/command.css";

type CommandProps = TCommand & {
	selected: number;
	index: number;
	setSelected: React.Dispatch<React.SetStateAction<number>>;
};

export const Command: React.FC<CommandProps> = ({ icon, name, accelerator, event, selected, index, setSelected }) => {
	const dispatch = useAppDispatch();

	const Icon = useIcon(icon);
	const [isSelected, setIsSelected] = React.useState<boolean>(false);

	React.useEffect(() => {
		setIsSelected(selected === index);
	}, [selected, index]);

	const handleMouseOver = () => setSelected(index);
	const handleClick = () => dispatch({ type: "@top-bar/run-command", payload: event });

	return (
		<div
			className={`top-bar-command ${isSelected && "top-bar-selected-command"}`}
			onMouseOver={handleMouseOver}
			onClick={handleClick}
		>
			<div className="top-bar-command-info">
				<Icon className="top-bar-command-icon" />
				<div>{name}</div>
			</div>
			<Accelerator accelerator={accelerator} />
		</div>
	);
};
