import React from "react";

import { Command as TCommand } from "@containers/app/types";
import { Accelerator } from "@modules/top-bar/components/accelerator";
import { useAppDispatch } from "@core/state/store";
import { useIcon } from "@core/hooks/use-icon";

export const Command: React.FC<
	TCommand & { selected: number; index: number; setSelected: React.Dispatch<React.SetStateAction<number>> }
> = ({ icon, name, description, accelerator, event, selected, index, setSelected }) => {
	const dispatch = useAppDispatch();

	const Icon = useIcon(icon);
	const [isSelected, setIsSelected] = React.useState<boolean>(false);

	React.useEffect(() => {
		setIsSelected(selected === index);
	}, [selected, index]);

	return (
		<div
			className={`flex space-x-2 text-sm p-2 first-of-type:rounded-t-lg last-of-type:rounded-b-lg cursor-pointer select-none ${
				isSelected && "bg-neutral-200 dark:bg-neutral-700"
			}`}
			onMouseOver={() => setSelected(index)}
			onClick={() => dispatch({ type: "@top-bar/run-command", payload: event })}
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
