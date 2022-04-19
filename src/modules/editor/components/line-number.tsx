import React from "react";

export const LineNumber: React.FC<{ number: number }> = ({ number }) => (
	<div
		contentEditable={false}
		className="w-12 py-1 select-none self-stretch flex items-center flex-shrink-0 justify-end border-r border-neutral-200 dark:border-neutral-600 text-right pr-2 font-mono text-neutral-500 dark:text-neutral-400 text-sm"
	>
		{number ?? " "}
	</div>
);
