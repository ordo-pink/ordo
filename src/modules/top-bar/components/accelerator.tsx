import React from "react";

import { useAppSelector } from "@core/state/store";

import "@modules/top-bar/components/accelerator.css";

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
		<div className="top-bar-accelerator">
			{split.includes("CommandOrControl") ? <kbd className="top-bar-accelerator-key">{ctrl}</kbd> : null}
			{split.includes("Shift") ? <kbd className="top-bar-accelerator-key">⇧</kbd> : null}
			{split.includes("Alt") ? <kbd className="top-bar-accelerator-key">{alt}</kbd> : null}
			<kbd className="top-bar-accelerator-key">{split[split.length - 1]}</kbd>
		</div>
	);
};
