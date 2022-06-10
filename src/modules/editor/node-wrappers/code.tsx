import React from "react";

export const CodeWrapper =
	(): React.FC =>
	({ children }) =>
		(
			<code className="px-2 py-0.5 rounded-lg bg-neutral-300 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200">
				{children}
			</code>
		);
