import { getSupportedIcon } from "@core/appearance/icons";
import { Command as TCommand } from "@containers/app/types";
import React from "react";
import { Accelerator } from "./accelerator";
import { useAppDispatch } from "@core/state/store";

export const Command: React.FC<
	TCommand & { selected: number; index: number; setSelected: React.Dispatch<React.SetStateAction<number>> }
> = ({ icon, name, description, accelerator, event, selected, index, setSelected }) => {
	const dispatch = useAppDispatch();

	const Icon = icon ? getSupportedIcon(icon) : () => null;
	const isSelected = selected === index;

	return (
		<div
			className={`flex space-x-2 text-sm p-2 first-of-type:rounded-t-lg last-of-type:rounded-b-lg cursor-pointer select-none ${
				isSelected && "bg-neutral-200 dark:bg-neutral-700"
			}`}
			onMouseOver={() => setSelected(index)}
			onClick={() => dispatch({ "@top-bar/run-command": event })}
		>
			<div className="flex-grow">
				<div className="flex items-center space-x-2">
					<Icon className="text-neutral-500" />
					<div>{name}</div>
				</div>

				<div>{description}</div>
			</div>
			<Accelerator accelerator={accelerator} />
		</div>
	);
};
