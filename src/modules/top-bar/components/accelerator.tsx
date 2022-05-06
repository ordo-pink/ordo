import React from "react";

export const Accelerator: React.FC<{ accelerator: string }> = ({ accelerator = "" }) => {
	const [split, setSplit] = React.useState<string[]>([]);

	React.useEffect(() => {
		setSplit(accelerator.split("+"));
	}, [accelerator]);

	return (
		<div className="flex align-baseline items-center space-x-1">
			{split.includes("CommandOrControl") && (
				<kbd className="border border-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2">⌘</kbd>
			)}
			{split.includes("Shift") && (
				<kbd className="border border-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2">⇧</kbd>
			)}
			{split.includes("Alt") && (
				<kbd className="border border-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2">⌥</kbd>
			)}
			<kbd className="border border-neutral-200 bg-neutral-100 dark:bg-neutral-800  rounded-md px-2">
				{split[split.length - 1]}
			</kbd>
		</div>
	);
};
