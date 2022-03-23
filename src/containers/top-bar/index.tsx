import React from "react";

export const TopBar: React.FC = () => (
	<div style={{ "-webkit-app-region": "drag", cursor: "move" } as any} className="flex items-center justify-center pt-2">
		<div style={{ "-webkit-app-region": "none" } as any} className="w-[60%]">
			<input
				type="text"
				placeholder="Quick search (start with : to go to line or > to open commands)"
				className="w-full shadow-inner text-sm cursor-default rounded-xl outline-none focus:outline-1 focus:outline-neutral-400 bg-neutral-200 dark:bg-neutral-600 px-2 py-1"
			/>
		</div>
	</div>
);
