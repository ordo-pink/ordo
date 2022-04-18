import React from "react";

export const Accelerator = React.memo<{ accelerator: string }>(({ accelerator }) => {
	if (!accelerator) {
		return null;
	}

	const split = accelerator.split("+");

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
});
