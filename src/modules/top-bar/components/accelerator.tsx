import React from "react";

import { useAppSelector } from "@core/state/store";

type AcceleratorProps = {
	accelerator?: string;
};

export const Accelerator: React.FC<AcceleratorProps> = ({ accelerator = "" }) => {
	const platform = useAppSelector((state) => state.app.internalSettings.platform);

	const [split, setSplit] = React.useState<string[]>([]);
	const [alt, setAlt] = React.useState<string>("Alt");
	const [ctrl, setCtrl] = React.useState<string>("Ctrl");

	React.useEffect(() => {
		setSplit(accelerator.split("+"));
	}, [accelerator]);

	React.useEffect(() => {
		if (platform === "darwin") {
			setCtrl("⌘");
			setAlt("⌥");
		}
	}, [platform]);

	return (
		<div className="top-bar_accelerator">
			{split.includes("CommandOrControl") ? <kbd className="top-bar_accelerator_key">{ctrl}</kbd> : null}
			{split.includes("Shift") ? <kbd className="top-bar_accelerator_key">⇧</kbd> : null}
			{split.includes("Alt") ? <kbd className="top-bar_accelerator_key">{alt}</kbd> : null}
			<kbd className="top-bar_accelerator_key">{split[split.length - 1]}</kbd>
		</div>
	);
};
